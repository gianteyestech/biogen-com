import sys
import os
import re
import json
import time
import requests
from bs4 import BeautifulSoup

# Ensure utf-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://www.khandryfruits.com"
PRODUCTS_URL = f"{BASE_URL}/products"
IMG_DIR = "public/images/products"

def clean_filename(name):
    # Remove special characters to make a clean filename
    name = re.sub(r'[^a-zA-Z0-9\s\-\_]', '', name)
    name = name.strip().replace(' ', '_').lower()
    return name

def download_image(url, filename):
    try:
        if not url.startswith('http'):
            url = BASE_URL + url
        filepath = os.path.join(IMG_DIR, filename)
        if not os.path.exists(filepath):
            r = requests.get(url, stream=True, timeout=15)
            if r.status_code == 200:
                with open(filepath, 'wb') as f:
                    for chunk in r.iter_content(1024):
                        f.write(chunk)
                print(f"Downloaded image: {filename}")
            else:
                print(f"Failed to download image {url}")
        return f"/images/products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return url

def parse_weight_from_name(name):
    name_lower = name.lower()
    if '250g' in name_lower or '250gm' in name_lower:
        return '250g'
    elif '500g' in name_lower or '500gm' in name_lower:
        return '500g'
    elif '1kg' in name_lower or '1 kg' in name_lower:
        return '1kg'
    return '250g'  # default

def get_proportional_prices(base_price, base_weight):
    # Standard Pakistani dry fruit scaling
    if base_weight == '250g':
        p250 = base_price
        p500 = int(base_price * 1.95 / 10) * 10
        p1000 = int(base_price * 3.8 / 10) * 10
    elif base_weight == '500g':
        p250 = int(base_price / 1.95 / 10) * 10
        p500 = base_price
        p1000 = int(base_price * 1.95 / 10) * 10
    elif base_weight == '1kg':
        p250 = int(base_price / 3.8 / 10) * 10
        p500 = int(base_price / 1.95 / 10) * 10
        p1000 = base_price
    else:
        p250 = base_price
        p500 = int(base_price * 1.95 / 10) * 10
        p1000 = int(base_price * 3.8 / 10) * 10

    return {
        "250g": p250,
        "500g": p500,
        "1kg": p1000
    }

def main():
    print("Starting Khan Dry Fruits scraping script...")
    os.makedirs(IMG_DIR, exist_ok=True)
    
    # We will loop page=1 to page=11
    products = []
    page = 1
    
    while True:
        print(f"\n--- Scraping Catalog Page {page} ---")
        url = f"{PRODUCTS_URL}?page={page}"
        r = requests.get(url, timeout=15)
        if r.status_code != 200:
            print(f"Failed to fetch page {page}, status: {r.status_code}")
            break
            
        soup = BeautifulSoup(r.text, 'html.parser')
        
        # Check product single hover elements
        cards = soup.select('.product-single-hover')
        if not cards:
            print("No more products found.")
            break
            
        print(f"Found {len(cards)} product cards on page {page}.")
        
        for idx, card in enumerate(cards):
            try:
                # Find product link
                link_el = card.select_one('a[href*="/product/"]')
                if not link_el:
                    continue
                product_url = link_el.get('href')
                if not product_url.startswith('http'):
                    product_url = BASE_URL + product_url
                    
                # Find image
                img_el = card.select_one('img[src*="product/thumbnail"]')
                if not img_el:
                    img_el = card.select_one('img')
                if not img_el:
                    continue
                    
                img_url = img_el.get('src')
                name = img_el.get('alt', '').strip()
                if not name:
                    name_el = card.select_one('.single-product-details h3 a')
                    if name_el:
                        name = name_el.text.strip()
                if not name:
                    name = f"Product-{page}-{idx}"
                    
                # Prices on card
                price_span = card.select_one('.product-price .text-accent')
                del_el = card.select_one('.product-price del')
                
                # Parse current price
                current_price = 1000
                if price_span:
                    price_text = price_span.text.strip()
                    nums = re.sub(r'[^\d]', '', price_text)
                    if nums:
                        current_price = int(nums)
                        
                # Parse original price
                original_price = current_price
                if del_el:
                    del_text = del_el.text.strip()
                    nums = re.sub(r'[^\d]', '', del_text)
                    if nums:
                        original_price = int(nums)
                else:
                    # check for discount value like -10% or -Rs200
                    disc_el = card.select_one('.for-discount-value')
                    if disc_el:
                        disc_text = disc_el.text.strip()
                        if '%' in disc_text:
                            pct = int(re.sub(r'[^\d]', '', disc_text))
                            original_price = int(current_price / (1 - pct/100))
                        elif 'Rs' in disc_text:
                            amount = int(re.sub(r'[^\d]', '', disc_text))
                            original_price = current_price + amount
                            
                # Stock status
                out_of_stock = card.select_one('.out_fo_stock') is not None
                
                # generate slug / ID
                prod_id = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
                
                # image local download path
                img_ext = 'webp'
                if '.jpg' in img_url.lower():
                    img_ext = 'jpg'
                elif '.jpeg' in img_url.lower():
                    img_ext = 'jpeg'
                elif '.png' in img_url.lower():
                    img_ext = 'png'
                
                local_img_filename = f"{prod_id}.{img_ext}"
                local_img_path = download_image(img_url, local_img_filename)
                
                # Now fetch product details page to get category, description and weights
                print(f"Fetching details for product: {name}")
                details_r = requests.get(product_url, timeout=15)
                category_id = "mix"
                description = name
                weights_list = []
                
                if details_r.status_code == 200:
                    details_soup = BeautifulSoup(details_r.text, 'html.parser')
                    
                    # 1. Category extraction (decomposing header/footer)
                    for h in details_soup.find_all(['header', 'footer']):
                        h.decompose()
                    for mh in details_soup.select('.mobile-head, .navbar-sticky, .navbar'):
                        mh.decompose()
                        
                    first_cat_link = None
                    for a in details_soup.find_all('a'):
                        href = a.get('href') or ''
                        if 'category/' in href:
                            first_cat_link = href
                            break
                            
                    if first_cat_link:
                        category_id = first_cat_link.split('/category/')[-1].split('?')[0].strip()
                        
                    # 2. Description
                    desc_el = details_soup.select_one('.p-details-description') or details_soup.select_one('.rich-editor-html-content')
                    if desc_el:
                        description = desc_el.text.strip()
                        
                    # 3. Radio options for weights
                    radios = details_soup.select('input[type="radio"][name^="choice_"]')
                    for rad in radios:
                        # Find corresponding label or value
                        val = rad.get('value', '').strip()
                        if val and val not in weights_list:
                            weights_list.append(val)
                            
                # Categories mapping cleanup
                if not category_id or category_id == 'products':
                    category_id = 'mix'
                    
                # Setup price variation map
                parsed_weight = parse_weight_from_name(name)
                
                if not weights_list:
                    weights_list = ['250g', '500g', '1kg']
                    
                prices_map = {}
                original_prices_map = {}
                
                # Estimate prices for weights list
                for w in weights_list:
                    est_current = get_proportional_prices(current_price, parsed_weight)[w if w in ['250g', '500g', '1kg'] else '250g']
                    est_original = get_proportional_prices(original_price, parsed_weight)[w if w in ['250g', '500g', '1kg'] else '250g']
                    prices_map[w] = est_current
                    original_prices_map[w] = est_original
                    
                product_data = {
                    "id": prod_id,
                    "name": name,
                    "urduName": "",
                    "category": category_id,
                    "description": description,
                    "rating": 4.5 if idx % 2 == 0 else 5.0,
                    "reviewsCount": 5 + idx * 2,
                    "imageUrl": local_img_path,
                    "prices": prices_map,
                    "originalPrices": original_prices_map,
                    "inStock": not out_of_stock,
                    "featured": idx < 4,
                    "isNew": page == 1 and idx < 3,
                    "badge": ""
                }
                
                # Check for duplicate
                if not any(p['id'] == prod_id for p in products):
                    products.append(product_data)
                    print(f"Added product: {name} under category: {category_id}")
                
            except Exception as e:
                print(f"Error scraping product: {e}")
                
        # Move to next page
        page += 1
        # Prevent hitting server too hard
        time.sleep(1)
        
    print(f"\nScraping complete. Total products collected: {len(products)}")
    
    # Save products to file
    with open('src/cms/products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print("Saved products to src/cms/products.json")

if __name__ == "__main__":
    main()
