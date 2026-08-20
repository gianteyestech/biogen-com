/**
 * fix_image_mapping.js
 * Intelligently remaps product images in products.json:
 * - Assigns real product photos to matching products by name/generic keyword
 * - Uses appropriate category-based generic placeholders for unmatched products
 * - Excludes person/people photos entirely from product catalog
 */

const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/cms/products.json');

// ─── REAL IMAGE CATALOG (from visual audit) ───────────────────────────────────
// Excluded (people/person photos): 1, 26, 27, 28, 29, 30, 31, 32, 33, 34
const REAL_IMAGES = {
  // Antiseptic / Topical Solutions
  dermatol_liquid:      '/images/products/med_img_2.webp',   // Dermatol antiseptic liquid (Chloroxylenol) 200ml
  dermatol_wipes:       '/images/products/med_img_20.webp',  // Dermatol Multi-Use wipes
  poviderm:             '/images/products/med_img_4.webp',   // Poviderm (Povidone-Iodine) 200ml
  surgical_spirit_200:  '/images/products/med_img_5.webp',   // SSG Surgical Spirit 200ml
  surgical_spirit_100:  '/images/products/med_img_7.webp',   // SSG Surgical Spirit 100ml
  peroxide_6:           '/images/products/med_img_9.webp',   // Peroxide 6% (Hydrogen Peroxide)
  cetorid_syrup:        '/images/products/med_img_6.webp',   // Cetorid (Cetirizine) 100ml oral syrup

  // Topical Creams / Dermatology
  hucort_cream:         '/images/products/med_img_10.webp',  // Hucort (Hydrocortisone Acetate) 30gm cream
  micobase_cream:       '/images/products/med_img_12.webp',  // Micobase (Miconazole Nitrate) 30gm cream
  naomi_bg_cream:       '/images/products/med_img_8.webp',   // Naomi-BG (Clotrimazole+Betamethasone) cream
  mitex_cream:          '/images/products/med_img_13.webp',  // Mitex (Permethrin) 30gm cream
  mitex_lotion:         '/images/products/med_img_16.webp',  // Mitex Lotion 60ml (scabies)

  // Syrups / Vitamins / OTC
  vitaglobin_syrup:     '/images/products/med_img_18.webp',  // Vitaglobin Iron+Vitamins 250ml syrup
  zinc_syrup:           '/images/products/med_img_35.webp',  // Aulta Zink Syrup (Zinc Sulphate) 200ml

  // Eye Drops (Ophthalmic)
  glazol_t_eyedrops:    '/images/products/med_img_22.webp',  // Glazol-T (Dorzolamide+Timolol) — Schazoo
  ketro_eyedrops:       '/images/products/med_img_23.webp',  // Ketro (Ketorolac) 0.5% eye drops
  quinocip_eyedrops:    '/images/products/med_img_24.webp',  // Quinocip (Ciprofloxacin) 0.3% eye drops
  neotears_eyedrops:    '/images/products/med_img_25.webp',  // Neo Tears (Hypromellose) lubricant eye drops

  // Capsules / Injections
  prostop_capsules:     '/images/products/med_img_36.webp',  // Prostop (Tamsulosin HCl) 3x10 capsules
  dakra_injection:      '/images/products/med_img_39.webp',  // Dakra (Omeprazole) 40mg IV injection

  // OTC / Consumables
  adult_diapers:        '/images/products/med_img_21.webp',  // DryWell Adult Diapers XL
};

// ─── CATEGORY-BASED GENERIC FALLBACKS ──────────────────────────────────────
const CATEGORY_FALLBACK = {
  'prescription-medicines':     '/images/products/pharma_tablets.webp',
  'otc-medicines':              '/images/products/pharma_tablets.webp',
  'eye-care':                   '/images/products/pharma_eyedrops.webp',
  'vitamins-supplements':       '/images/products/pharma_syrup.webp',
  'surgical-clinical-supplies': '/images/products/pharma_injection.webp',
  'medical-devices-equipment':  '/images/products/pharma_injection.webp',
  'orthopedic-rehabilitation':  '/images/products/pharma_injection.webp',
  'oral-dental-care':           '/images/products/pharma_tablets.webp',
  'skin-dermatology':           '/images/products/pharma_cream.webp',
  'first-aid-wound-care':       '/images/products/pharma_injection.webp',
  'maternal-child-health':      '/images/products/pharma_syrup.webp',
  'hospital-furniture':         '/images/products/pharma_injection.webp',
  'diagnostic-equipment':       '/images/products/pharma_injection.webp',
  'cotton-gauze-consumables':   '/images/products/pharma_cotton.webp',
  'rapid-diagnostic-tests':     '/images/products/pharma_rapid_test.webp',
};

const DEFAULT_FALLBACK = '/images/products/pharma_tablets.webp';

// ─── KEYWORD MATCHING RULES ──────────────────────────────────────────────────
// Priority: more specific → less specific
// Returns a real image path if a keyword matches product name or genericName
function matchRealImage(product) {
  const name = (product.name || '').toLowerCase();
  const generic = (product.genericName || '').toLowerCase();
  const combined = name + ' ' + generic;

  // Exact product name matches (highest priority)
  if (combined.includes('dermatol') && combined.includes('wipe'))       return REAL_IMAGES.dermatol_wipes;
  if (combined.includes('dermatol'))                                     return REAL_IMAGES.dermatol_liquid;
  if (combined.includes('poviderm') || (combined.includes('povidone') && combined.includes('iodine'))) return REAL_IMAGES.poviderm;
  if (combined.includes('surgical spirit') && combined.includes('100')) return REAL_IMAGES.surgical_spirit_100;
  if (combined.includes('surgical spirit'))                              return REAL_IMAGES.surgical_spirit_200;
  if (combined.includes('peroxide') || combined.includes('hydrogen peroxide')) return REAL_IMAGES.peroxide_6;
  if (combined.includes('cetorid') || (combined.includes('cetirizine') && combined.includes('syrup'))) return REAL_IMAGES.cetorid_syrup;
  if (combined.includes('hucort') || combined.includes('hydrocortisone acetate')) return REAL_IMAGES.hucort_cream;
  if (combined.includes('micobase') || (combined.includes('miconazole') && combined.includes('cream'))) return REAL_IMAGES.micobase_cream;
  if (combined.includes('naomi') || (combined.includes('clotrimazole') && combined.includes('betamethasone'))) return REAL_IMAGES.naomi_bg_cream;
  if ((combined.includes('mitex') || combined.includes('permethrin')) && combined.includes('lotion')) return REAL_IMAGES.mitex_lotion;
  if (combined.includes('mitex') || combined.includes('permethrin'))    return REAL_IMAGES.mitex_cream;
  if (combined.includes('vitaglobin') || (combined.includes('ferric') && combined.includes('syrup'))) return REAL_IMAGES.vitaglobin_syrup;
  if (combined.includes('aulta') || (combined.includes('zinc') && combined.includes('syrup'))) return REAL_IMAGES.zinc_syrup;
  if (combined.includes('glazol') || (combined.includes('dorzolamide') && combined.includes('timolol'))) return REAL_IMAGES.glazol_t_eyedrops;
  if (combined.includes('ketro') || combined.includes('ketorolac'))     return REAL_IMAGES.ketro_eyedrops;
  if (combined.includes('quinocip') || (combined.includes('ciprofloxacin') && combined.includes('eye'))) return REAL_IMAGES.quinocip_eyedrops;
  if (combined.includes('neo tears') || combined.includes('hypromellose') || combined.includes('lubricant eye')) return REAL_IMAGES.neotears_eyedrops;
  if (combined.includes('prostop') || combined.includes('tamsulosin'))  return REAL_IMAGES.prostop_capsules;
  if (combined.includes('dakra') || (combined.includes('omeprazole') && combined.includes('inj'))) return REAL_IMAGES.dakra_injection;
  if (combined.includes('diaper') || combined.includes('incontinence')) return REAL_IMAGES.adult_diapers;

  // Category-level real image overrides
  if (combined.includes('eye drop') || combined.includes('ophthalmic') || combined.includes('eye solution')) return REAL_IMAGES.glazol_t_eyedrops;
  if (combined.includes('antiseptic') || combined.includes('disinfectant')) return REAL_IMAGES.dermatol_liquid;
  if (combined.includes('cream') && (combined.includes('antifungal') || combined.includes('miconazole') || combined.includes('clotrimazole'))) return REAL_IMAGES.micobase_cream;
  if (combined.includes('cream') && (combined.includes('hydrocortisone') || combined.includes('steroid'))) return REAL_IMAGES.hucort_cream;
  if (combined.includes('injection') || combined.includes(' iv ') || combined.includes('infusion') || combined.includes('vial')) return REAL_IMAGES.dakra_injection;
  if (combined.includes('syrup') && (combined.includes('iron') || combined.includes('vitamin'))) return REAL_IMAGES.vitaglobin_syrup;
  if (combined.includes('syrup') && (combined.includes('zinc') || combined.includes('zink'))) return REAL_IMAGES.zinc_syrup;
  if (combined.includes('cotton') || combined.includes('gauze') || combined.includes('bandage')) return REAL_IMAGES.dermatol_wipes;
  if (combined.includes('capsule') || combined.includes('cap '))        return REAL_IMAGES.prostop_capsules;

  return null; // No match — use category fallback
}

// ─── MAIN LOGIC ──────────────────────────────────────────────────────────────
const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));

let matched = 0;
let fallback = 0;

const updated = products.map(p => {
  const realImage = matchRealImage(p);

  if (realImage) {
    matched++;
    return { ...p, imageUrl: realImage };
  }

  // Use category-level generic fallback
  const categoryImage = CATEGORY_FALLBACK[p.category] || DEFAULT_FALLBACK;
  fallback++;
  return { ...p, imageUrl: categoryImage };
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

console.log(`\n✅ Image remapping complete!`);
console.log(`   Real product images matched: ${matched}`);
console.log(`   Category fallbacks used:     ${fallback}`);
console.log(`   Total products:              ${updated.length}`);
console.log(`\n🚫 Excluded from catalog (person/people photos):`);
console.log(`   med_img_1.webp  (CEO photo)`);
console.log(`   med_img_26-34.webp (factory/partnership visit photos)`);
