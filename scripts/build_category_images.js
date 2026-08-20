const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const catDir = path.join(__dirname, '..', 'public', 'images', 'categories');
if (!fs.existsSync(catDir)) fs.mkdirSync(catDir, { recursive: true });

// Map departments to their high-resolution authentic photos in public/images/products
const DEPARTMENT_IMAGE_SOURCES = [
  { id: 'prescription-medicines', src: 'med_img_38.webp', out: 'cat_prescriptions.webp' },
  { id: 'surgical-clinical-supplies', src: 'care_medical_br_tc_set.webp', out: 'cat_surgical.webp' },
  { id: 'medical-devices-equipment', src: 'electric_icu_hospital_bed.webp', out: 'cat_medical_devices.webp' },
  { id: 'eye-care', src: 'ophthalmic_surgical_loupes.webp', out: 'cat_eye_care.webp' },
  { id: 'orthopedic-rehabilitation', src: 'ortho_locking_compression_plate_system.webp', out: 'cat_orthopedics.webp' },
  { id: 'oral-dental-care', src: 'dental_extraction_forceps_set.webp', out: 'cat_dental.webp' },
  { id: 'skin-care-dermatology', src: 'med_img_10.webp', out: 'cat_dermatology.webp' },
  { id: 'vitamins-supplements', src: 'med_img_18.webp', out: 'cat_vitamins.webp' },
  { id: 'first-aid-wound-care', src: 'med_img_4.webp', out: 'cat_first_aid.webp' },
  { id: 'health-monitoring-tests', src: 'med_img_2.webp', out: 'cat_diagnostics.webp' },
  { id: 'mother-baby', src: 'med_img_6.webp', out: 'cat_mother_baby.webp' },
  { id: 'respiratory-care', src: 'med_img_35.webp', out: 'cat_respiratory.webp' }
];

async function buildCategoryImages() {
  const prodDir = path.join(__dirname, '..', 'public', 'images', 'products');
  console.log('Building authentic clinical department images...');

  for (const item of DEPARTMENT_IMAGE_SOURCES) {
    const srcPath = path.join(prodDir, item.src);
    const destPath = path.join(catDir, item.out);

    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(600, 600, { fit: 'contain', background: { r: 248, g: 250, b: 252, alpha: 1 } })
        .webp({ quality: 92 })
        .toFile(destPath);
      console.log(`✓ Created Category Image: ${item.out} from ${item.src}`);
    } else {
      console.warn(`! Missing source: ${srcPath}`);
    }
  }

  // Update categories.json with these clean local category image paths
  const catJsonPath = path.join(__dirname, '..', 'src', 'cms', 'categories.json');
  const catData = JSON.parse(fs.readFileSync(catJsonPath, 'utf-8'));

  catData.circleCats = catData.circleCats.map(c => {
    const match = DEPARTMENT_IMAGE_SOURCES.find(s => s.id === c.id);
    if (match) {
      const url = `/images/categories/${match.out}`;
      return { ...c, img: url, image: url };
    }
    return c;
  });

  fs.writeFileSync(catJsonPath, JSON.stringify(catData, null, 2));
  console.log('✓ Updated categories.json with new local category images.');
}

buildCategoryImages().catch(console.error);
