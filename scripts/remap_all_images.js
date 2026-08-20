/**
 * remap_all_images.js
 * Complete visual-audit-based image remapping for all products
 */
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/cms/products.json');

const IMG = {
  dermatol_liquid:     '/images/products/med_img_2.webp',
  dermatol_label:      '/images/products/med_img_3.webp',
  poviderm:            '/images/products/med_img_4.webp',
  surgical_spirit_200: '/images/products/med_img_5.webp',
  cetorid_syrup:       '/images/products/med_img_6.webp',
  surgical_spirit_100: '/images/products/med_img_7.webp',
  naomi_bg_cream:      '/images/products/med_img_8.webp',
  peroxide_6:          '/images/products/med_img_9.webp',
  hucort_cream:        '/images/products/med_img_10.webp',
  micobase_cream:      '/images/products/med_img_12.webp',
  mitex_cream:         '/images/products/med_img_13.webp',
  peroxide_label:      '/images/products/med_img_15.webp',
  mitex_lotion:        '/images/products/med_img_16.webp',
  vitaglobin_syrup:    '/images/products/med_img_18.webp',
  vitaglobin_promo:    '/images/products/med_img_19.webp',
  dermatol_wipes:      '/images/products/med_img_20.webp',
  adult_diapers:       '/images/products/med_img_21.webp',
  glazol_t:            '/images/products/med_img_22.webp',
  ketro_eye:           '/images/products/med_img_23.webp',
  quinocip_eye:        '/images/products/med_img_24.webp',
  neo_tears:           '/images/products/med_img_25.webp',
  aulta_zink:          '/images/products/med_img_35.webp',
  prostop_capsule:     '/images/products/med_img_37.webp',
  dakra_injection:     '/images/products/med_img_38.webp',
};

const CATEGORY_FALLBACK = {
  'prescription-medicines':     '/images/products/pharma_tablets.webp',
  'otc-medicines':              '/images/products/pharma_tablets.webp',
  'eye-care':                   '/images/products/pharma_eyedrops.webp',
  'vitamins-supplements':       '/images/products/pharma_syrup.webp',
  'surgical-clinical-supplies': '/images/products/pharma_injection.webp',
  'medical-devices-equipment':  '/images/products/pharma_injection.webp',
  'orthopedic-rehabilitation':  '/images/products/pharma_injection.webp',
  'oral-dental-care':           '/images/products/pharma_tablets.webp',
  'skin-care-dermatology':      '/images/products/pharma_cream.webp',
  'first-aid-wound-care':       '/images/products/pharma_injection.webp',
  'mother-baby':                '/images/products/pharma_syrup.webp',
  'health-monitoring-tests':    '/images/products/pharma_rapid_test.webp',
  'womens-health':              '/images/products/pharma_tablets.webp',
  'respiratory-care':           '/images/products/pharma_tablets.webp',
  'home-healthcare':            '/images/products/pharma_syrup.webp',
};

const DEFAULT_FALLBACK = '/images/products/pharma_tablets.webp';

function matchImage(product) {
  const n = (product.name || '').toLowerCase();
  const g = (product.genericName || '').toLowerCase();
  const c = n + ' ' + g;

  if (c.includes('dermatol') && (c.includes('wipe') || c.includes('multi'))) return IMG.dermatol_wipes;
  if (c.includes('dermatol')) return IMG.dermatol_liquid;
  if (c.includes('poviderm') || c.includes('povidon') || (c.includes('povidone') && c.includes('iodine'))) return IMG.poviderm;
  if (c.includes('surgical spirit') && c.includes('100')) return IMG.surgical_spirit_100;
  if (c.includes('surgical spirit')) return IMG.surgical_spirit_200;
  if (c.includes('peroxide') || c.includes('hydrogen peroxide')) return IMG.peroxide_6;

  if (c.includes('cetorid') || c.includes('cetrizine') || c.includes('cetirizine') || c.includes('allergicare')) return IMG.cetorid_syrup;

  if (c.includes('naomi') || (c.includes('clotrimazole') && c.includes('betamethasone'))) return IMG.naomi_bg_cream;
  if (c.includes('hucort') || c.includes('hydrocortisone acetate') || c.includes('hydro cream') || c.includes('hydro-cream')) return IMG.hucort_cream;
  if (c.includes('micobase') || c.includes('miconazol') || c.includes('miconazole')) return IMG.micobase_cream;
  if ((c.includes('mitex') || c.includes('permethrin') || c.includes('permtrin')) && c.includes('lotion')) return IMG.mitex_lotion;
  if (c.includes('mitex') || c.includes('permethrin') || c.includes('permtrin')) return IMG.mitex_cream;
  if (c.includes('calamine')) return IMG.hucort_cream;
  if (c.includes('pile cream')) return IMG.hucort_cream;

  if (c.includes('glazol') || (c.includes('dorzolamide') && c.includes('timolol'))) return IMG.glazol_t;
  if (c.includes('timosol') || c.includes('tobra d')) return IMG.glazol_t;
  if (c.includes('ketro') || c.includes('ketorolac')) return IMG.ketro_eye;
  if (c.includes('quinocip') || (c.includes('ciprofloxacin') && c.includes('eye'))) return IMG.quinocip_eye;
  if (c.includes('neo tears') || c.includes('neotears') || c.includes('hypromellose') || c.includes('lubricant eye')) return IMG.neo_tears;

  if (c.includes('vitaglobin')) return IMG.vitaglobin_promo;
  if ((c.includes('iron') && c.includes('syrup')) || c.includes('ferric ammonium')) return IMG.vitaglobin_syrup;
  if (c.includes('multivitamin') && (c.includes('syrp') || c.includes('syrup'))) return IMG.vitaglobin_syrup;
  if (c.includes('vitamin b') && (c.includes('syrp') || c.includes('syrup'))) return IMG.vitaglobin_syrup;
  if (c.includes('vitamin c') && (c.includes('syrp') || c.includes('syrup'))) return IMG.vitaglobin_syrup;

  if (c.includes('aulta') || c.includes('zink') || c.includes('zilgit') || (c.includes('zinc') && c.includes('syrup'))) return IMG.aulta_zink;

  if (c.includes('prostop') || c.includes('tamsulosin')) return IMG.prostop_capsule;
  if ((c.includes('cap') || c.includes('capsule')) && (c.includes('gaboz') || c.includes('p-gab') || c.includes('pregabalin') || c.includes('gabapentin') || c.includes('omeprazol cap'))) return IMG.prostop_capsule;

  if (c.includes('dakra') || (c.includes('omeprazole') && c.includes('inj'))) return IMG.dakra_injection;
  if (c.includes('injection') || c.includes(' i.v') || c.includes('infusion set') || c.includes('iv canula') || c.includes('iv cannula') || c.includes('vial')) return IMG.dakra_injection;
  if (c.includes('gemclav') && c.includes('inj')) return IMG.dakra_injection;

  if (c.includes('diaper') || c.includes('incontinence') || c.includes('drywell')) return IMG.adult_diapers;
  if (c.includes('cotton') || c.includes('gauze') || c.includes('bandage') || c.includes('creap')) return IMG.dermatol_wipes;

  return null;
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
let matched = 0, fallback = 0;

const updated = products.map(p => {
  const realImage = matchImage(p);
  if (realImage) { matched++; return { ...p, imageUrl: realImage }; }
  const catImage = CATEGORY_FALLBACK[p.category] || DEFAULT_FALLBACK;
  fallback++;
  return { ...p, imageUrl: catImage };
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

console.log('\n✅ Visual-audit image remapping complete!');
console.log(`   Real product images assigned: ${matched}`);
console.log(`   Category fallbacks used:      ${fallback}`);
console.log(`   Total products updated:       ${updated.length}`);

// Show breakdown
const imgUsage = {};
updated.filter(p => p.imageUrl.includes('med_img_')).forEach(p => {
  const img = p.imageUrl.split('/').pop();
  if (!imgUsage[img]) imgUsage[img] = 0;
  imgUsage[img]++;
});
console.log('\n📊 Real image usage:');
Object.entries(imgUsage).sort().forEach(([img, count]) => console.log(`   ${img}: ${count} products`));
