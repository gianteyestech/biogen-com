const sharp = require('sharp');
const path = require('path');

async function extractEmblem() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');

  // Exact bounds for ONLY the circular DNA-Helix emblem (excluding the bottom baseline)
  const cropLeft = 228;
  const cropTop = 4;
  const cropWidth = 250;
  const cropHeight = 228;

  console.log('Extracting isolated pure DNA emblem:', { cropLeft, cropTop, cropWidth, cropHeight });

  const emblemBuffer = await sharp(logoPath)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight,
    })
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // 1. Master 512x512 PNG
  await sharp(emblemBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));

  // 2. Next.js App Router Icon
  await sharp(emblemBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(__dirname, '..', 'src', 'app', 'icon.png'));

  // 3. Apple Touch Icon (180x180)
  await sharp(emblemBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
    
  await sharp(emblemBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, '..', 'src', 'app', 'apple-icon.png'));

  // 4. Standard 32x32 Favicon
  await sharp(emblemBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, '..', 'public', 'favicon-32x32.png'));

  console.log('Isolated DNA Emblem Favicon successfully created!');
}

extractEmblem().catch(console.error);
