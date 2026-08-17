import json

def main():
    fpath = 'src/cms/categories.json'
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Deduplicate categories list
    categories_seen = set()
    dedup_categories = []
    for c in data['categories']:
        if c['id'] not in categories_seen:
            categories_seen.add(c['id'])
            dedup_categories.append(c)
            
    # Deduplicate megaMenu list
    mega_seen = set()
    dedup_mega = []
    for m in data['megaMenu']:
        if m['id'] not in mega_seen:
            mega_seen.add(m['id'])
            # Deduplicate and sort subcategories
            subs_seen = set()
            dedup_subs = []
            for sub in m.get('subcategories', []):
                if sub['id'] not in subs_seen:
                    subs_seen.add(sub['id'])
                    dedup_subs.append(sub)
            m['subcategories'] = sorted(dedup_subs, key=lambda x: x['name'])
            dedup_mega.append(m)
            
    # Deduplicate circleCats list
    circle_seen = set()
    dedup_circle = []
    for c in data['circleCats']:
        if c['id'] not in circle_seen:
            circle_seen.add(c['id'])
            dedup_circle.append(c)
            
    data['categories'] = dedup_categories
    data['megaMenu'] = dedup_mega
    data['circleCats'] = dedup_circle
    
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        
    print("Deduplicated categories.json successfully!")

if __name__ == "__main__":
    main()
