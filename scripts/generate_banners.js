const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const destDir = path.join(__dirname, '..', 'public', 'images', 'banners');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Helper to create SVG banner
function createBannerSvg({
  width = 1920,
  height = 800,
  gradientStart = '#0A192F',
  gradientEnd = '#020C1B',
  accentColor = '#0072CE',
  accentGlow = '#00A3E0',
  title = 'BIOGEN PHARMA',
  subtitle = 'Institutional Medical Supply',
  badge = 'GMP CERTIFIED',
  gridType = 'dots',
}) {
  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}"/>
        <stop offset="60%" stop-color="${gradientEnd}"/>
        <stop offset="100%" stop-color="#020813"/>
      </linearGradient>

      <!-- Glow radial gradient -->
      <radialGradient id="accentGlow" cx="80%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${accentGlow}" stop-opacity="0.35"/>
        <stop offset="50%" stop-color="${accentColor}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${gradientEnd}" stop-opacity="0"/>
      </radialGradient>

      <radialGradient id="leftGlow" cx="20%" cy="80%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${gradientStart}" stop-opacity="0"/>
      </radialGradient>

      <!-- Medical Cross Pattern -->
      <pattern id="medicalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 20 v20 M20 30 h20" stroke="#ffffff" stroke-width="1" stroke-opacity="0.04"/>
        <circle cx="30" cy="30" r="1" fill="#ffffff" fill-opacity="0.08"/>
      </pattern>

      <!-- Hexagon Pattern -->
      <pattern id="hexGrid" width="80" height="138.56" patternUnits="userSpaceOnUse">
        <path d="M40 0 L80 23.09 L80 69.28 L40 92.38 L0 69.28 L0 23.09 Z M40 138.56 L80 115.47 L80 69.28 L40 46.19 L0 69.28 L0 115.47 Z" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.035"/>
      </pattern>
    </defs>

    <!-- Main Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

    <!-- Decorative Grids -->
    <rect width="${width}" height="${height}" fill="url(#${gridType === 'hex' ? 'hexGrid' : 'medicalGrid'})"/>
    <rect width="${width}" height="${height}" fill="url(#accentGlow)"/>
    <rect width="${width}" height="${height}" fill="url(#leftGlow)"/>

    <!-- Modern Abstract Shapes / Molecule Lines (Right Side) -->
    <g opacity="0.65" transform="translate(1100, 100)">
      <!-- Central Glowing Circle -->
      <circle cx="400" cy="300" r="240" fill="none" stroke="${accentGlow}" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.4"/>
      <circle cx="400" cy="300" r="170" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.6"/>
      <circle cx="400" cy="300" r="100" fill="${accentColor}" fill-opacity="0.08" stroke="${accentGlow}" stroke-width="2"/>

      <!-- Medical Cross in Center -->
      <path d="M400 240 v120 M340 300 h120" stroke="${accentGlow}" stroke-width="16" stroke-linecap="round"/>

      <!-- Node Network -->
      <line x1="400" y1="130" x2="600" y2="80" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="600" cy="80" r="8" fill="${accentGlow}"/>
      
      <line x1="400" y1="470" x2="580" y2="520" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="580" cy="520" r="10" fill="${accentColor}"/>

      <line x1="230" y1="300" x2="100" y2="380" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="100" cy="380" r="7" fill="${accentGlow}"/>

      <line x1="570" y1="300" x2="720" y2="240" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.5"/>
      <circle cx="720" cy="240" r="9" fill="${accentGlow}"/>
    </g>

    <!-- Floating Hexagons & Glassmorphism Shapes -->
    <g opacity="0.25">
      <polygon points="1750,200 1800,230 1800,290 1750,320 1700,290 1700,230" fill="${accentColor}" stroke="${accentGlow}" stroke-width="2"/>
      <polygon points="1250,550 1300,580 1300,640 1250,670 1200,640 1200,580" fill="${accentGlow}" stroke="${accentColor}" stroke-width="1.5"/>
      <polygon points="1550,650 1620,690 1620,770 1550,810 1480,770 1480,690" fill="none" stroke="${accentColor}" stroke-width="2"/>
    </g>

    <!-- Ambient Waves -->
    <path d="M0 650 Q 400 550, 960 620 T 1920 580 L 1920 800 L 0 800 Z" fill="${accentColor}" fill-opacity="0.04"/>
    <path d="M0 720 Q 600 680, 1200 740 T 1920 700 L 1920 800 L 0 800 Z" fill="${accentGlow}" fill-opacity="0.06"/>
  </svg>
  `;
}

const BANNERS = [
  {
    name: 'biogen_banner_1.webp',
    svgOptions: {
      gradientStart: '#061938',
      gradientEnd: '#020C1B',
      accentColor: '#0072CE',
      accentGlow: '#00A3E0',
      gridType: 'hex',
    }
  },
  {
    name: 'biogen_banner_2.webp',
    svgOptions: {
      gradientStart: '#08253D',
      gradientEnd: '#031422',
      accentColor: '#0284C7',
      accentGlow: '#38BDF8',
      gridType: 'dots',
    }
  },
  {
    name: 'biogen_banner_3.webp',
    svgOptions: {
      gradientStart: '#063828',
      gradientEnd: '#021B13',
      accentColor: '#10B981',
      accentGlow: '#34D399',
      gridType: 'hex',
    }
  },
  {
    name: 'biogen_banner_4.webp',
    svgOptions: {
      gradientStart: '#1D144A',
      gradientEnd: '#0C0824',
      accentColor: '#8B5CF6',
      accentGlow: '#A78BFA',
      gridType: 'dots',
    }
  }
];

async function buildBanners() {
  console.log('Building high-resolution WebP hero banners...');
  for (const b of BANNERS) {
    const svg = createBannerSvg(b.svgOptions);
    const destPath = path.join(destDir, b.name);
    await sharp(Buffer.from(svg))
      .webp({ quality: 92 })
      .toFile(destPath);
    console.log(`[OK] Generated: ${b.name} (1920x800 WebP)`);
  }
  console.log('All hero banners built successfully!');
}

buildBanners().catch(err => {
  console.error('Failed to build banners:', err);
  process.exit(1);
});
