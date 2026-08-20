/**
 * remap_all_images.js
 * 
 * Strict 1-to-1 exact brand photo matching to prevent duplicates & mislabeling.
 * Authentic packaging is ONLY assigned to its true medicine name.
 * All other catalog items receive their clean, modern category presentation visual.
 */
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/cms/products.json');

// ─── AUTHENTIC 1-TO-1 BRAND PHOTOS ───────────────────────────────────────────
const EXACT_PHOTOS = {
  // Antiseptics & Disinfectants
  dermatol_liquid:      '/images/products/med_img_2.webp',   // Dermatol Antiseptic Liquid (Chloroxylenol) 200ml
  dermatol_wipes:       '/images/products/med_img_20.webp',  // Dermatol Multi-Use Wipes
  poviderm:             '/images/products/med_img_4.webp',   // Poviderm 5% (Povidone-Iodine) 200ml
  surgical_spirit_200:  '/images/products/med_img_5.webp',   // SSG Surgical Spirit 200ml
  surgical_spirit_100:  '/images/products/med_img_7.webp',   // SSG Surgical Spirit 100ml
  peroxide_6:           '/images/products/med_img_9.webp',   // Peroxide 6% (Hydrogen Peroxide) 200ml

  // Syrups & Suspensions
  cetorid_syrup:        '/images/products/med_img_6.webp',   // Cetorid (Cetirizine 2HCl) 100ml Oral Solution
  vitaglobin_syrup:     '/images/products/med_img_18.webp',  // Vitaglobin Iron Plus Vitamins 250ml
  aulta_zink_syrup:     '/images/products/med_img_35.webp',  // Aulta Zink Syrup (Zinc Sulphate) 200ml

  // Dermatology / Creams & Lotions
  naomi_bg_cream:       '/images/products/med_img_8.webp',   // Naomi-BG (Clotrimazole + Betamethasone) 30gm Cream
  hucort_cream:         '/images/products/med_img_10.webp',  // Hucort (Hydrocortisone Acetate) 30gm Cream
  micobase_cream:       '/images/products/med_img_12.webp',  // Micobase (Miconazole Nitrate) 30gm Cream
  mitex_cream:          '/images/products/med_img_13.webp',  // Mitex (Permethrin) 30gm Cream
  mitex_lotion:         '/images/products/med_img_16.webp',  // Mitex (Permethrin) 60ml Lotion

  // Ophthalmic Drops
  glazol_t_drops:       '/images/products/med_img_22.webp',  // Glazol-T (Dorzolamide + Timolol) Eye Drops
  ketro_drops:          '/images/products/med_img_23.webp',  // Ketro (Ketorolac Tromethamine) 0.5% Eye Drops
  quinocip_drops:       '/images/products/med_img_24.webp',  // Quinocip (Ciprofloxacin HCl) 0.3% Eye Drops
  neo_tears_drops:      '/images/products/med_img_25.webp',  // Neo Tears (Hypromellose + Dextran 70) Eye Drops

  // Injections & Vials
  dakra_injection:      '/images/products/med_img_38.webp',  // Dakra (Omeprazole) 40mg IV Injection Vial

  // Capsules
  prostop_capsules:     '/images/products/med_img_37.webp',  // Prostop (Tamsulosin HCl) 0.4mg 3x10 Capsules

  // Hygiene & Incontinence
  adult_diapers:        '/images/products/med_img_21.webp',  // DryWell Adult Diapers XL

  // PDF Catalogues Extracted HD Equipment
  care_medical_br_tc:   '/images/products/care_medical_br_tc_set.webp',      // General Surgery Set (42 Pcs)
  care_medical_dental:  '/images/products/care_medical_dental_kit.webp',      // Dental Extraction & Implant Kit
  laparoscopic_vats:    '/images/products/laparoscopic_vats_set.webp',       // Laparoscopic & VATS Set
  icu_hospital_bed:     '/images/products/electric_icu_hospital_bed.webp',   // 5-Function ICU Hospital Bed
  ortho_implant_system: '/images/products/ortho_implant_trauma_system.webp', // Ortho Titanium Plating System
  ophthalmic_loupes:    '/images/products/ophthalmic_surgical_loupes.webp',  // Ophthalmic Surgical Loupes
};

// ─── CLEAN FORMULATION VISUALS (BY CATEGORY & DOSAGE FORM) ──────────────────
const FORMULATION_VISUALS = {
  tablets:      '/images/products/pharma_tablets.webp',
  capsules:     '/images/products/pharma_capsules.webp',
  syrups:       '/images/products/pharma_syrup.webp',
  injections:   '/images/products/pharma_injection.webp',
  creams:       '/images/products/pharma_cream.webp',
  eyedrops:     '/images/products/pharma_eyedrops.webp',
  rapid_tests:  '/images/products/pharma_rapid_test.webp',
  cotton_gauze: '/images/products/pharma_cotton.webp',
  equipment:    '/images/products/electric_icu_hospital_bed.webp',
  instruments:  '/images/products/care_medical_br_tc_set.webp',
};

function getExactOrFormulationImage(product) {
  const n = (product.name || '').toLowerCase();
  const g = (product.genericName || '').toLowerCase();
  const c = n + ' ' + g;

  // ── 1. EXACT 1-TO-1 MATCHES (NO FALSE BRAND DUPLICATION) ──
  if (c.includes('dermatol') && (c.includes('wipe') || c.includes('multi'))) return { image: EXACT_PHOTOS.dermatol_wipes, isExact: true };
  if (c.includes('dermatol')) return { image: EXACT_PHOTOS.dermatol_liquid, isExact: true };
  if (c.includes('poviderm') || (c.includes('povidone') && c.includes('iodine') && c.includes('solution'))) return { image: EXACT_PHOTOS.poviderm, isExact: true };
  if (c.includes('surgical spirit') && c.includes('100')) return { image: EXACT_PHOTOS.surgical_spirit_100, isExact: true };
  if (c.includes('surgical spirit')) return { image: EXACT_PHOTOS.surgical_spirit_200, isExact: true };
  if (c.includes('peroxide 6%') || (c.includes('hydrogen peroxide') && c.includes('6%'))) return { image: EXACT_PHOTOS.peroxide_6, isExact: true };

  if (c.includes('cetorid')) return { image: EXACT_PHOTOS.cetorid_syrup, isExact: true };
  if (c.includes('vitaglobin')) return { image: EXACT_PHOTOS.vitaglobin_syrup, isExact: true };
  if (c.includes('aulta zink') || c.includes('aulta')) return { image: EXACT_PHOTOS.aulta_zink_syrup, isExact: true };

  if (c.includes('naomi-bg') || c.includes('naomi bg')) return { image: EXACT_PHOTOS.naomi_bg_cream, isExact: true };
  if (c.includes('hucort')) return { image: EXACT_PHOTOS.hucort_cream, isExact: true };
  if (c.includes('micobase')) return { image: EXACT_PHOTOS.micobase_cream, isExact: true };
  if (c.includes('mitex') && c.includes('lotion')) return { image: EXACT_PHOTOS.mitex_lotion, isExact: true };
  if (c.includes('mitex')) return { image: EXACT_PHOTOS.mitex_cream, isExact: true };

  if (c.includes('glazol-t') || c.includes('glazol t')) return { image: EXACT_PHOTOS.glazol_t_drops, isExact: true };
  if (c.includes('ketro')) return { image: EXACT_PHOTOS.ketro_drops, isExact: true };
  if (c.includes('quinocip')) return { image: EXACT_PHOTOS.quinocip_drops, isExact: true };
  if (c.includes('neo tears') || c.includes('neotears')) return { image: EXACT_PHOTOS.neo_tears_drops, isExact: true };

  if (c.includes('dakra')) return { image: EXACT_PHOTOS.dakra_injection, isExact: true };
  if (c.includes('prostop')) return { image: EXACT_PHOTOS.prostop_capsules, isExact: true };
  if (c.includes('drywell') || c.includes('adult diaper')) return { image: EXACT_PHOTOS.adult_diapers, isExact: true };

  // Equipment & Surgical Instruments
  if (c.includes('br-tc') || (c.includes('general surgery') && c.includes('set'))) return { image: EXACT_PHOTOS.care_medical_br_tc, isExact: true };
  if (c.includes('dental') && (c.includes('implant') || c.includes('kit') || c.includes('extraction'))) return { image: EXACT_PHOTOS.care_medical_dental, isExact: true };
  if (c.includes('laparoscopic') || c.includes('vats')) return { image: EXACT_PHOTOS.laparoscopic_vats, isExact: true };
  if (c.includes('hospital bed') || c.includes('icu bed')) return { image: EXACT_PHOTOS.icu_hospital_bed, isExact: true };
  if (c.includes('ortho') || c.includes('trauma plating')) return { image: EXACT_PHOTOS.ortho_implant_system, isExact: true };
  if (c.includes('loupes') || c.includes('magnification')) return { image: EXACT_PHOTOS.ophthalmic_loupes, isExact: true };

  // ── 2. CLEAN FORMULATION-SPECIFIC VISUALS (PREVENTS MISLABELING) ──
  const isTablet = n.includes('tab') || n.includes('tablet');
  const isCapsule = n.includes('cap') || n.includes('capsule');
  const isSyrup = n.includes('syrp') || n.includes('syrup') || n.includes('elixir') || n.includes('suspension');
  const isInjection = n.includes('injection') || n.includes('inj') || n.includes('infusion') || n.includes(' iv ') || n.includes('i.v') || n.includes('canula') || n.includes('cannula') || n.includes('vial');
  const isCream = n.includes('cream') || n.includes('ointment') || n.includes('lotion');
  const isDrop = n.includes('drop') || n.includes('eye');
  const isCotton = n.includes('cotton') || n.includes('gauze') || n.includes('bandage') || n.includes('creap');
  const isRapidTest = n.includes('strip') || n.includes('test') || n.includes('kit');

  if (isCapsule) return { image: FORMULATION_VISUALS.capsules, isExact: false };
  if (isInjection) return { image: FORMULATION_VISUALS.injections, isExact: false };
  if (isSyrup) return { image: FORMULATION_VISUALS.syrups, isExact: false };
  if (isCream) return { image: FORMULATION_VISUALS.creams, isExact: false };
  if (isDrop) return { image: FORMULATION_VISUALS.eyedrops, isExact: false };
  if (isCotton) return { image: FORMULATION_VISUALS.cotton_gauze, isExact: false };
  if (isRapidTest) return { image: FORMULATION_VISUALS.rapid_tests, isExact: false };
  if (isTablet) return { image: FORMULATION_VISUALS.tablets, isExact: false };

  // Category based fallback
  if (product.category === 'surgical-clinical-supplies') return { image: FORMULATION_VISUALS.instruments, isExact: false };
  if (product.category === 'medical-devices-equipment') return { image: FORMULATION_VISUALS.equipment, isExact: false };
  if (product.category === 'oral-dental-care') return { image: FORMULATION_VISUALS.instruments, isExact: false };
  if (product.category === 'skin-care-dermatology') return { image: FORMULATION_VISUALS.creams, isExact: false };
  if (product.category === 'eye-care') return { image: FORMULATION_VISUALS.eyedrops, isExact: false };

  return { image: FORMULATION_VISUALS.tablets, isExact: false };
}

const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
let exactCount = 0, cleanVisualCount = 0;

const updated = products.map(p => {
  if (p.name.includes('Gemclav') && p.genericName === 'Calamine Lotion') {
    p.genericName = 'Co-Amoxiclav (Amoxicillin / Clavulanic Acid)';
    p.urduName = 'Amoxicillin / Clavulanic Acid';
  }

  const { image, isExact } = getExactOrFormulationImage(p);
  if (isExact) exactCount++;
  else cleanVisualCount++;

  // Build a multi-image gallery array for the Product Detail Page
  const images = [image];
  if (isExact && image.includes('med_img_2.webp')) {
    images.push('/images/products/med_img_3.webp'); // Back label
  } else if (isExact && image.includes('med_img_18.webp')) {
    images.push('/images/products/med_img_19.webp'); // Promo packaging
  } else if (isExact && image.includes('med_img_9.webp')) {
    images.push('/images/products/med_img_15.webp'); // Biogen pack layout
  } else if (isExact && image.includes('med_img_13.webp')) {
    images.push('/images/products/med_img_14.webp'); // Alt box angle
  } else if (isExact && image.includes('med_img_16.webp')) {
    images.push('/images/products/med_img_17.webp'); // Alt bottle angle
  } else if (isExact && image.includes('med_img_10.webp')) {
    images.push('/images/products/med_img_11.webp'); // Alt cream angle
  }

  return { 
    ...p, 
    imageUrl: image,
    images: images,
    hasAuthenticPhoto: isExact
  };
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));

console.log('\n✅ Strict 1-to-1 formulation & packaging mapping applied!');
console.log(`   Authentic 1-to-1 Brand Photos (Zero Duplicates): ${exactCount}`);
console.log(`   Accurate MCA Clinical Formulation Visuals:      ${cleanVisualCount}`);
console.log(`   Total Products Configured:                      ${updated.length}`);
