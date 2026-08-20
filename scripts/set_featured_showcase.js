const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/cms/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));

// Highlighted items with authentic high-res packaging & equipment photos
const FEATURED_HERO_IDS = [
  'dakra-injection',
  'care-medical-br-tc-general-surgery-set',
  'biogen-five-function-electric-icu-hospital-bed',
  'glazol-t-eye-drop',
  'care-medical-dental-implant-surgery-kit',
  'biogen-precision-led-surgical-loupes-3-5x',
  'vitaglobin-syrup-250ml',
  'laparoscopic-minimally-invasive-vats-instrument-set',
  'ortho-bone-implant-and-trauma-plating-system',
  'povidon-100ml',
  'hucort-cream-30gm',
  'mitex-lotion-60ml',
  'drywell-adult-diapers-xl',
  'aulta-zink-syrup-200ml',
  'prostop-0-4mg-capsules',
  'dermatol-soap',
];

const updated = products.map(p => {
  // Check if product is in featured list or matches authentic equipment/medicines
  const isTarget = FEATURED_HERO_IDS.includes(p.id) || 
    p.name.includes('CARE MEDICAL') || 
    p.name.includes('Biogen 5-Function') || 
    p.name.includes('Laparoscopic') || 
    p.name.includes('Dakra') ||
    p.name.includes('Glazol') ||
    p.name.includes('Povidon') ||
    p.name.includes('Vitaglobin') ||
    p.name.includes('Hucort');

  if (isTarget) {
    return { ...p, featured: true, isNew: true };
  }
  return p;
});

fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updated, null, 2));
console.log('✓ Successfully prioritized authentic real medicine & surgical products in featured showcase!');
