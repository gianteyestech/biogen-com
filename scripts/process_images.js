const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  const srcDir = path.join(__dirname, '..', 'scratch', 'products_data');
  const destDir = path.join(__dirname, '..', 'public', 'images', 'products');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  console.log(`Found ${files.length} images to optimize...`);

  const imageMap = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const srcPath = path.join(srcDir, file);
    const cleanName = `med_img_${i + 1}.webp`;
    const destPath = path.join(destDir, cleanName);

    try {
      await sharp(srcPath)
        .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(destPath);
      
      imageMap.push({ original: file, url: `/images/products/${cleanName}` });
      console.log(`✓ Optimized: ${file} -> ${cleanName}`);
    } catch (err) {
      console.error(`✗ Failed to optimize ${file}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'image_map.json'), JSON.stringify(imageMap, null, 2));
  console.log(`Saved ${imageMap.length} image mappings.`);
}

optimizeImages();
