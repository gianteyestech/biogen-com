// scripts/generate_medical_assets.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const destDir = path.join(__dirname, '..', 'public', 'images', 'products');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const assets = [
  {
    name: 'pharma_tablets.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F8FAFC"/>
        </linearGradient>
        <linearGradient id="blueBanner" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0072CE"/>
          <stop offset="100%" stop-color="#00A3E0"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#bg)"/>
      <g filter="url(#shadow)">
        <!-- Medicine Box Packaging -->
        <rect x="90" y="110" width="420" height="380" rx="20" fill="url(#boxGrad)" stroke="#CBD5E1" stroke-width="2"/>
        <!-- Top Colored Banner -->
        <path d="M 90 130 Q 90 110 110 110 L 490 110 Q 510 110 510 130 L 510 200 L 90 200 Z" fill="url(#blueBanner)"/>
        <!-- Cross Icon -->
        <rect x="440" y="135" width="40" height="40" rx="8" fill="#FFFFFF" opacity="0.2"/>
        <path d="M 456 145 H 464 V 165 H 456 Z M 446 153 H 474 V 159 H 446 Z" fill="#FFFFFF"/>
        <!-- Brand Header text -->
        <text x="130" y="155" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#E0F2FE" letter-spacing="2">BIOGEN PHARMA · CLINICAL SUPPLY</text>
        <text x="130" y="185" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">PHARMACEUTICAL TABLETS</text>
        <!-- Blister Pack Rendering -->
        <rect x="130" y="230" width="340" height="180" rx="14" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
        <!-- 8 Foil Cavities -->
        <rect x="155" y="250" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="185" cy="280" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="235" y="250" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="265" cy="280" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="315" y="250" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="345" cy="280" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="395" y="250" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="425" cy="280" r="22" fill="#38BDF8" opacity="0.9"/>
        
        <rect x="155" y="330" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="185" cy="360" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="235" y="330" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="265" cy="360" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="315" y="330" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="345" cy="360" r="22" fill="#38BDF8" opacity="0.9"/>
        <rect x="395" y="330" width="60" height="60" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <circle cx="425" cy="360" r="22" fill="#38BDF8" opacity="0.9"/>
        
        <!-- Bottom specs bar -->
        <rect x="130" y="430" width="340" height="35" rx="8" fill="#F1F5F9"/>
        <text x="145" y="452" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0369A1">Rx ONLY · cGMP CERTIFIED · MCA APPROVED</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_capsules.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        <linearGradient id="capTop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#E11D48"/>
          <stop offset="100%" stop-color="#F43F5E"/>
        </linearGradient>
        <linearGradient id="capBot" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#F1F5F9"/>
        </linearGradient>
        <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="url(#bg2)"/>
      <g filter="url(#shadow2)">
        <!-- Bottle Body -->
        <rect x="210" y="180" width="180" height="280" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
        <!-- Bottle Neck & Cap -->
        <rect x="250" y="140" width="100" height="40" rx="6" fill="#0072CE"/>
        <rect x="240" y="110" width="120" height="35" rx="8" fill="#005EA6"/>
        <!-- Bottle Label -->
        <rect x="215" y="230" width="170" height="170" fill="#F8FAFC" stroke="#E2E8F0"/>
        <rect x="215" y="230" width="170" height="35" fill="#E11D48"/>
        <text x="300" y="253" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">ORAL CAPSULES</text>
        <text x="300" y="300" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#0F172A" text-anchor="middle">BIOGEN PHARMA</text>
        <text x="300" y="325" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#64748B" text-anchor="middle">100 Hard Gelatin Capsules</text>
        <rect x="240" y="350" width="120" height="24" rx="6" fill="#F1F5F9" stroke="#CBD5E1"/>
        <text x="300" y="366" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#E11D48" text-anchor="middle">GMP CERTIFIED</text>
        <!-- Floating 3D Capsule -->
        <g transform="translate(130, 320) rotate(-35)">
          <rect x="0" y="0" width="55" height="65" rx="27" fill="url(#capTop)"/>
          <rect x="0" y="55" width="55" height="65" rx="27" fill="url(#capBot)" stroke="#CBD5E1" stroke-width="1.5"/>
        </g>
        <g transform="translate(420, 350) rotate(25)">
          <rect x="0" y="0" width="50" height="60" rx="25" fill="#0072CE"/>
          <rect x="0" y="50" width="50" height="60" rx="25" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
        </g>
      </g>
    </svg>`
  },
  {
    name: 'pharma_syrup.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#78350F"/>
          <stop offset="50%" stop-color="#B45309"/>
          <stop offset="100%" stop-color="#78350F"/>
        </linearGradient>
        <filter id="shadow3" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F1F5F9"/>
      <g filter="url(#shadow3)">
        <!-- Amber Bottle -->
        <rect x="220" y="170" width="160" height="310" rx="25" fill="url(#amberGlass)"/>
        <!-- Bottle Neck & Cap -->
        <rect x="265" y="125" width="70" height="45" fill="#B45309"/>
        <rect x="250" y="85" width="100" height="45" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <!-- Measuring Cup on Top -->
        <path d="M 240 85 L 245 45 L 355 45 L 360 85 Z" fill="#E2E8F0" opacity="0.6" stroke="#94A3B8" stroke-width="2"/>
        <!-- Front Label -->
        <rect x="230" y="220" width="140" height="200" rx="8" fill="#FFFFFF"/>
        <rect x="230" y="220" width="140" height="40" fill="#0284C7"/>
        <text x="300" y="245" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">ORAL SUSPENSION</text>
        <text x="300" y="285" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0F172A" text-anchor="middle">PHARMA SYRUP</text>
        <text x="300" y="310" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0284C7" text-anchor="middle">100 ml / 200 ml</text>
        <text x="300" y="340" font-family="Arial, sans-serif" font-size="9" fill="#64748B" text-anchor="middle">Sugar Free · Pediatric / Adult</text>
        <rect x="245" y="370" width="110" height="25" rx="6" fill="#F0FDF4" stroke="#86EFAC"/>
        <text x="300" y="386" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#166534" text-anchor="middle">MCA REGISTERED</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_injection.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <linearGradient id="vialGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="50%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <filter id="shadow4" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F8FAFC"/>
      <g filter="url(#shadow4)">
        <!-- Sterile Injection Vial -->
        <rect x="220" y="200" width="160" height="260" rx="20" fill="url(#vialGlass)" stroke="#94A3B8" stroke-width="2"/>
        <!-- Aluminum Crimp Seal & Flip-off Cap -->
        <rect x="255" y="160" width="90" height="40" fill="#64748B"/>
        <rect x="245" y="130" width="110" height="32" rx="10" fill="#0284C7"/>
        <!-- Vial Liquid Fill Level -->
        <rect x="225" y="320" width="150" height="130" rx="15" fill="#38BDF8" opacity="0.3"/>
        <!-- Vial Label -->
        <rect x="230" y="225" width="140" height="135" fill="#FFFFFF" stroke="#E2E8F0"/>
        <rect x="230" y="225" width="140" height="30" fill="#0072CE"/>
        <text x="300" y="245" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">STERILE INJECTION</text>
        <text x="300" y="280" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle">FOR IV / IM USE</text>
        <text x="300" y="305" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0072CE" text-anchor="middle">Single Dose Vial / Ampoule</text>
        <text x="300" y="335" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#059669" text-anchor="middle">100% PYROGEN FREE</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_eyedrops.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <filter id="shadow5" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F1F5F9"/>
      <g filter="url(#shadow5)">
        <!-- Sterile Dropper Bottle Body -->
        <rect x="230" y="230" width="140" height="230" rx="30" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.5"/>
        <!-- Dropper Tip & Ribbed Cap -->
        <path d="M 285 100 L 295 70 L 305 70 L 315 100 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="255" y="100" width="90" height="130" rx="12" fill="#0891B2"/>
        <!-- Rib lines on cap -->
        <line x1="270" y1="115" x2="270" y2="215" stroke="#06B6D4" stroke-width="2"/>
        <line x1="285" y1="115" x2="285" y2="215" stroke="#06B6D4" stroke-width="2"/>
        <line x1="300" y1="115" x2="300" y2="215" stroke="#06B6D4" stroke-width="2"/>
        <line x1="315" y1="115" x2="315" y2="215" stroke="#06B6D4" stroke-width="2"/>
        <line x1="330" y1="115" x2="330" y2="215" stroke="#06B6D4" stroke-width="2"/>
        <!-- Label -->
        <rect x="240" y="270" width="120" height="130" fill="#F8FAFC" stroke="#E2E8F0"/>
        <rect x="240" y="270" width="120" height="28" fill="#0891B2"/>
        <text x="300" y="289" font-family="Arial, sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">OPHTHALMIC DROPS</text>
        <text x="300" y="325" font-family="Arial, sans-serif" font-size="13" font-weight="900" fill="#0F172A" text-anchor="middle">STERILE EYE DROPS</text>
        <text x="300" y="350" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#0891B2" text-anchor="middle">5ml / 10ml Bottle</text>
        <text x="300" y="380" font-family="Arial, sans-serif" font-size="8.5" font-weight="bold" fill="#059669" text-anchor="middle">STERILITY GUARANTEED</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_cream.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <filter id="shadow6" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F8FAFC"/>
      <g filter="url(#shadow6)">
        <!-- Ointment Tube body -->
        <polygon points="210,120 390,120 350,420 250,420" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.5"/>
        <!-- Crimp seal top -->
        <rect x="200" y="100" width="200" height="25" rx="4" fill="#94A3B8"/>
        <!-- Screw Cap Bottom -->
        <rect x="260" y="420" width="80" height="50" rx="8" fill="#0072CE"/>
        <!-- Label area -->
        <rect x="235" y="160" width="130" height="200" fill="#F0FDF4" stroke="#BBF7D0"/>
        <rect x="235" y="160" width="130" height="35" fill="#16A34A"/>
        <text x="300" y="183" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">TOPICAL DERMA</text>
        <text x="300" y="230" font-family="Arial, sans-serif" font-size="15" font-weight="900" fill="#0F172A" text-anchor="middle">MEDICAL CREAM</text>
        <text x="300" y="260" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#16A34A" text-anchor="middle">Ointment / Lotion 20g-50g</text>
        <text x="300" y="320" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#475569" text-anchor="middle">FOR EXTERNAL USE ONLY</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_cotton.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <filter id="shadow7" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F1F5F9"/>
      <g filter="url(#shadow7)">
        <!-- Roll Package -->
        <rect x="140" y="160" width="320" height="280" rx="30" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
        <rect x="150" y="170" width="300" height="260" rx="20" fill="#3B82F6" opacity="0.1"/>
        <!-- Cotton Symbol & Texture -->
        <circle cx="300" cy="270" r="50" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="3"/>
        <circle cx="275" cy="255" r="25" fill="#F8FAFC"/>
        <circle cx="325" cy="255" r="25" fill="#F8FAFC"/>
        <circle cx="300" cy="290" r="25" fill="#F8FAFC"/>
        <!-- Typography -->
        <text x="300" y="360" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#0F172A" text-anchor="middle">100% ABSORBENT COTTON</text>
        <text x="300" y="385" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0284C7" text-anchor="middle">Hospital Grade · Sterile Wound Care</text>
        <text x="300" y="410" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#16A34A" text-anchor="middle">FARHAN COTTON INDUSTRY</text>
      </g>
    </svg>`
  },
  {
    name: 'pharma_rapid_test.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
      <defs>
        <filter id="shadow8" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="15" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="600" height="600" fill="#F8FAFC"/>
      <g filter="url(#shadow8)">
        <!-- Diagnostic Test Cassette -->
        <rect x="130" y="210" width="340" height="180" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.5"/>
        <!-- Sample Well (S) -->
        <circle cx="190" cy="300" r="22" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2"/>
        <text x="190" y="345" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#64748B" text-anchor="middle">S</text>
        <!-- Result Window (C & T) -->
        <rect x="250" y="270" width="160" height="60" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
        <!-- C Line (Control) -->
        <line x1="300" y1="280" x2="300" y2="320" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
        <text x="300" y="348" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B" text-anchor="middle">C</text>
        <!-- T Line (Test) -->
        <line x1="360" y1="280" x2="360" y2="320" stroke="#E11D48" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
        <text x="360" y="348" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748B" text-anchor="middle">T</text>
        <!-- Header -->
        <text x="300" y="245" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#0072CE" text-anchor="middle" letter-spacing="1">RAPID DIAGNOSTIC TEST STRIP</text>
      </g>
    </svg>`
  }
];

async function generateAssets() {
  for (const item of assets) {
    const filePath = path.join(destDir, item.name);
    await sharp(Buffer.from(item.svg))
      .webp({ quality: 90 })
      .toFile(filePath);
    console.log(`✓ Generated medical product asset: ${item.name}`);
  }
  console.log('All authentic medical assets generated successfully.');
}

generateAssets();
