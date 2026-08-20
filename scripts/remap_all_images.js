/**
 * remap_all_images.js
 * Form-factor & formulation aware image remapping
 */
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/cms/products.json');

const IMG = {
  // Antiseptic / Topical Liquid Solutions
  dermatol_liquid:     '/images/products/med_img_2.webp',   // Dermatol Liquid 200ml
  dermatol_wipes:      '/images/products/med_img_20.webp',  // Dermatol Multi-Use Wipes / Cotton / Gauze
  poviderm:            '/images/products/med_img_4.webp',   // Poviderm 5% (Povidone-Iodine) 200ml
  surgical_spirit_200: '/images/products/med_img_5.webp',   // Surgical Spirit 200ml
  surgical_spirit_100: '/images/products/med_img_7.webp',   // Surgical Spirit 100ml
  peroxide_6:          '/images/products/med_img_9.webp',   // Peroxide 6% (Hydrogen Peroxide) 200ml

  // Syrups / Suspensions / Oral Solutions
  cetorid_syrup:       '/images/products/med_img_6.webp',   // Cetorid (Cetirizine) 100ml Syrup
  vitaglobin_syrup:    '/images/products/med_img_18.webp',  // Vitaglobin Iron+Vitamins 250ml Syrup
  vitaglobin_promo:    '/images/products/med_img_19.webp',  // Vitaglobin Promotional Hero
  aulta_zink:          '/images/products/med_img_35.webp',  // Aulta Zink (Zinc Sulphate) 200ml Syrup

  // Topical Creams / Lotions (Dermatology)
  naomi_bg_cream:      '/images/products/med_img_8.webp',   // Naomi-BG (Clotrimazole+Betamethasone) Cream 30gm
  hucort_cream:        '/images/products/med_img_10.webp',  // Hucort (Hydrocortisone) Cream 30gm
  micobase_cream:      '/images/products/med_img_12.webp',  // Micobase (Miconazole) Cream 30gm
  mitex_cream:         '/images/products/med_img_13.webp',  // Mitex (Permethrin) Cream 30gm
  mitex_lotion:        '/images/products/med_img_16.webp',  // Mitex (Permethrin) Lotion 60ml

  // Eye Drops (Ophthalmic)
  glazol_t:            '/images/products/med_img_22.webp',  // Glazol-T (Dorzolamide+Timolol) Drops
  ketro_eye:           '/images/products/med_img_23.webp',  // Ketro (Ketorolac) 0.5% Drops
  quinocip_eye:        '/images/products/med_img_24.webp',  // Quinocip (Ciprofloxacin) 0.3% Drops
  neo_tears:           '/images/products/med_img_25.webp',  // Neo Tears (Hypromellose) Drops

  // Capsules
  prostop_capsule:     '/images/products/med_img_37.webp',  // Prostop (Tamsulosin) Capsules

  // Injections / IV Vials / Infusions
  dakra_injection:     '/images/products/med_img_38.webp',  // Dakra (Omeprazole) 40mg IV Injection Vial

  // Incontinence / Diapers
  adult_diapers:       '/images/products/med_img_21.webp',  // DryWell Adult Diapers XL
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

  const isTablet = n.includes('tab') || n.includes('tablet');
  const isCapsule = n.includes('cap') || n.includes('capsule');
  const isSyrup = n.includes('syrp') || n.includes('syrup') || n.includes('elixir') || n.includes('suspension');
  const isInjection = n.includes('injection') || n.includes('inj') || n.includes('infusion') || n.includes(' iv ') || n.includes('i.v') || n.includes('canula') || n.includes('cannula');
  const isCream = n.includes('cream') || n.includes('ointment');
  const isLotion = n.includes('lotion');
  const isDrop = n.includes('drop') || n.includes('eye');
  const isLiquid = n.includes('spirit') || n.includes('peroxide') || n.includes('solution') || n.includes('liquid') || n.includes('povidon') || n.includes('poviderm') || n.includes('dermatol');

  // Fix known data contamination on Gemclav
  if (n.includes('gemclav') && isInjection) {
    return IMG.dakra_injection;
  }

  // ── 1. INJECTIONS & IV INFUSIONS ──
  if (isInjection) {
    return IMG.dakra_injection;
  }

  // ── 2. EYE DROPS ──
  if (isDrop) {
    if (c.includes('ketro') || c.includes('ketorolac')) return IMG.ketro_eye;
    if (c.includes('quinocip') || c.includes('ciprofloxacin')) return IMG.quinocip_eye;
    if (c.includes('neo tears') || c.includes('neotears') || c.includes('hypromellose') || c.includes('lubricant')) return IMG.neo_tears;
    return IMG.glazol_t;
  }

  // ── 3. SYRUPS / ORAL LIQUIDS ──
  if (isSyrup) {
    if (c.includes('cetorid') || c.includes('cetirizine') || c.includes('cetrizine') || c.includes('allergicare')) return IMG.cetorid_syrup;
    if (c.includes('aulta') || c.includes('zink') || c.includes('zinc') || c.includes('zilgit')) return IMG.aulta_zink;
    if (c.includes('vitaglobin') || c.includes('iron') || c.includes('ferric') || c.includes('multivitamin') || c.includes('vitamin')) return IMG.vitaglobin_syrup;
    return IMG.vitaglobin_syrup;
  }

  // ── 4. LOTIONS ──
  if (isLotion) {
    if (c.includes('mitex') || c.includes('permethrin')) return IMG.mitex_lotion;
    return IMG.mitex_lotion;
  }

  // ── 5. CREAMS / OINTMENTS ──
  if (isCream) {
    if (c.includes('naomi') || (c.includes('clotrimazole') && c.includes('betamethasone'))) return IMG.naomi_bg_cream;
    if (c.includes('hucort') || c.includes('hydrocortisone') || c.includes('hydro')) return IMG.hucort_cream;
    if (c.includes('micobase') || c.includes('miconazol') || c.includes('miconazole')) return IMG.micobase_cream;
    if (c.includes('mitex') || c.includes('permethrin')) return IMG.mitex_cream;
    if (c.includes('pile')) return IMG.hucort_cream;
    return IMG.hucort_cream;
  }

  // ── 6. ANTISEPTIC & TOPICAL SOLUTIONS ──
  if (isLiquid) {
    if (c.includes('dermatol') && (c.includes('wipe') || c.includes('multi'))) return IMG.dermatol_wipes;
    if (c.includes('dermatol')) return IMG.dermatol_liquid;
    if (c.includes('poviderm') || c.includes('povidon') || c.includes('povidone')) return IMG.poviderm;
    if (c.includes('surgical spirit') && c.includes('100')) return IMG.surgical_spirit_100;
    if (c.includes('surgical spirit')) return IMG.surgical_spirit_200;
    if (c.includes('peroxide') || c.includes('hydrogen peroxide')) return IMG.peroxide_6;
  }

  // ── 7. CAPSULES ──
  if (isCapsule) {
    return IMG.prostop_capsule;
  }

  // ── 8. DIAPERS & HYGIENE ──
  if (c.includes('diaper') || c.includes('incontinence') || c.includes('drywell')) return IMG.adult_diapers;

  // ── 9. COTTON / GAUZE / BANDAGES ──
  if (c.includes('cotton') || c.includes('gauze') || c.includes('bandage') || c.includes('creap')) return IMG.dermatol_wipes;

  // ── 10. TABLETS (Use crisp tablet vector) ──
  if (isTablet) {
    return CATEGORY_FALLBACK['prescription-medicines'];
  }

  return null;
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
let matched = 0, fallback = 0;

const updated = products.map(p => {
  // Fix dirty genericName metadata for Gemclav injections if present
  if (p.name.includes('Gemclav') && p.genericName === 'Calamine Lotion') {
    p.genericName = 'Co-Amoxiclav (Amoxicillin / Clavulanic Acid)';
    p.urduName = 'Amoxicillin / Clavulanic Acid';
  }

  const realImage = matchImage(p);
  if (realImage) { 
    matched++; 
    return { ...p, imageUrl: realImage }; 
  }
  const catImage = CATEGORY_FALLBACK[p.category] || DEFAULT_FALLBACK;
  fallback++;
  return { ...p, imageUrl: catImage };
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

console.log('\n✅ Formulation-accurate image remapping complete!');
console.log(`   Real product images assigned: ${matched}`);
console.log(`   Category fallbacks used:      ${fallback}`);
console.log(`   Total products updated:       ${updated.length}`);
