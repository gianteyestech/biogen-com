import requests
from bs4 import BeautifulSoup
import json
import os
import re

BASE_URL = "https://www.khandryfruits.com"
PRODUCTS_URL = f"{BASE_URL}/products"
IMG_DIR = "public/images/products"

def download_image(url, filename):
    try:
        if not url.startswith('http'):
            url = BASE_URL + url
        filepath = os.path.join(IMG_DIR, filename)
        if not os.path.exists(filepath):
            r = requests.get(url, stream=True)
            if r.status_code == 200:
                with open(filepath, 'wb') as f:
                    for chunk in r.iter_content(1024):
                        f.write(chunk)
            else:
                print(f"Failed to download image {url}")
        return f"/images/products/{filename}"
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return url

def main():
    print("Fetching products page...")
    r = requests.get(PRODUCTS_URL)
    if r.status_code != 200:
        print(f"Failed to fetch {PRODUCTS_URL}, status: {r.status_code}")
        return

    os.makedirs(IMG_DIR, exist_ok=True)
    soup = BeautifulSoup(r.text, 'html.parser')
    products = []
    
    # We noticed images have 'product/thumbnail'
    imgs = soup.select('img[src*="product/thumbnail"]')
    print(f"Found {len(imgs)} thumbnail images.")
    
    for idx, img in enumerate(imgs):
        try:
            img_url = img.get('src')
            name = img.get('alt', f'Product {idx}')
            
            card = img.find_parent('div', class_='product-single-hover') or img.parent.parent.parent
            all_text = card.get_text(separator=' ', strip=True)
            
            # Find prices (Rs XXX)
            prices = [int(p.replace(',', '')) for p in re.findall(r'Rs\s*([\d,]+)', all_text)]
            prices = sorted(prices)
            
            if not prices:
                prices = [1000] # Default fallback

            price = prices[0]
            original_price = prices[-1] if len(prices) > 1 else price + int(price * 0.2)
            
            prod_id = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

            img_filename = f"{prod_id}.webp"
            local_img_url = download_image(img_url, img_filename)

            # Map category based on name
            category = "mix"
            if "almond" in name.lower() or "badam" in name.lower():
                category = "almonds"
            elif "dates" in name.lower() or "khajoor" in name.lower():
                category = "dates"
            elif "chocolate" in name.lower():
                category = "sweets"

            product = {
                "id": prod_id,
                "name": name,
                "urduName": "",
                "category": category,
                "subCategory": prod_id,
                "description": name,
                "rating": 5.0,
                "reviewsCount": 10,
                "imageUrl": local_img_url,
                "prices": { "250g": price, "500g": price * 2, "1kg": price * 4 },
                "originalPrices": { "250g": original_price, "500g": original_price * 2, "1kg": original_price * 4 },
                "inStock": "Out of stock" not in all_text,
                "featured": idx < 5,
                "isNew": idx < 3,
                "badge": ""
            }

            # Avoid duplicates
            if not any(p['id'] == prod_id for p in products):
                products.append(product)

        except Exception as e:
            print(f"Error processing a product: {e}")
            
    with open('src/cms/products.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2)

    print(f"Saved {len(products)} products to src/cms/products.json")

if __name__ == "__main__":
    main()
