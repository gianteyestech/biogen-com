import sys
import re
import json
from bs4 import BeautifulSoup

# Ensure utf-8 output
sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("Parsing categories from content.md...")
    
    with open('C:/Users/giant/.gemini/antigravity-ide/brain/362ed0cc-f2b0-4e23-b25c-c4f4efca1ae2/.system_generated/steps/735/content.md', 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # We want to find the categories navigation sidebar inside the HTML
    # Typically this is inside <div class="category-menu-wrap"> or similar,
    # or inside <ul class="dropdown-menu __dropdown-menu-2">.
    # Let's find all category list items in the main categories list.
    category_menu = soup.select('.category-menu-wrap .category-menu > li') or soup.select('ul.__dropdown-menu-2 > li')
    
    print(f"Found {len(category_menu)} category list items in the menu.")
    
    categories = []
    mega_menu = []
    circle_cats = []
    
    # Default icons map for categories
    icons_map = {
        "pistachios": "💚",
        "almonds": "🌰",
        "walnuts": "🪨",
        "cashews": "🥜",
        "dried-fruits": "🍇",
        "dried-fig": "🌿",
        "dates": "🌴",
        "raisins": "🍇",
        "apricots": "🍑",
        "dry-prunes": "🫐",
        "gift-box": "🎁",
        "pine-nuts-chilghoza": "🌲",
        "peanuts": "🥜",
        "dried-berries": "🍓",
        "chakwal-rewari-02": "🍬",
        "baking": "🧁",
        "murabba-jaat": "🍯",
        "seeds": "🌱",
        "spicy-masala": "🌶️",
        "snack": "🍿",
        "himalayan-shilajit": "🏔️",
        "organic-natural-foods": "🥗",
        "mix-dry-fruit": "🥣",
        "mix": "🥣",
        "honey": "🍯"
    }
    
    for li in category_menu:
        # Get category main link
        a_link = li.select_one('a')
        if not a_link:
            continue
            
        href = a_link.get('href', '')
        if 'category/' not in href:
            continue
            
        slug = href.split('/category/')[-1].split('?')[0].strip()
        
        # Name
        name_span = a_link.select_one('.line--limit-2') or a_link.select_one('span')
        name = name_span.text.strip() if name_span else a_link.text.strip()
        
        # Image
        img_el = a_link.select_one('img')
        img_url = img_el.get('src', '') if img_el else ''
        
        # Subcategories
        sub_list = []
        mega_menu_div = li.select_one('.mega_menu, .dropdown-menu')
        if mega_menu_div:
            sub_links = mega_menu_div.select('a')
            for sub_a in sub_links:
                sub_href = sub_a.get('href', '')
                if 'category/' in sub_href:
                    sub_slug = sub_href.split('/category/')[-1].split('?')[0].strip()
                    sub_name = sub_a.text.strip()
                    if sub_slug != slug and not any(s['id'] == sub_slug for s in sub_list):
                        sub_list.append({
                            "id": sub_slug,
                            "name": sub_name
                        })
                        
        icon = icons_map.get(slug, "🛍️")
        
        # Add to lists
        categories.append({
            "id": slug,
            "name": name,
            "icon": icon
        })
        
        mega_menu.append({
            "id": slug,
            "name": name,
            "icon": icon,
            "img": img_url,
            "subcategories": sub_list
        })
        
        # We also want to populate circleCats.
        # Let's add all main categories that have images to circleCats
        if img_url:
            circle_cats.append({
                "id": slug,
                "name": name,
                "img": img_url
            })
            
    print(f"Extracted {len(categories)} categories.")
    
    # Save to src/cms/categories.json
    output_data = {
        "categories": [{"id": "all", "name": "All Products", "icon": "🛍️"}] + categories,
        "megaMenu": mega_menu,
        "circleCats": circle_cats
    }
    
    with open('src/cms/categories.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
        
    print("Saved categories to src/cms/categories.json")

if __name__ == "__main__":
    main()
