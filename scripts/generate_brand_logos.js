// scripts/generate_brand_logos.js
const fs = require('fs');
const path = require('path');

const brandsDir = path.join(__dirname, '..', 'public', 'images', 'brands');
if (!fs.existsSync(brandsDir)) {
  fs.mkdirSync(brandsDir, { recursive: true });
}

const logos = {
  "highnoon": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Highnoon Sun & Horizon Logo -->
      <circle cx="28" cy="28" r="22" fill="#00529B"/>
      <path d="M14 28 C14 20, 42 20, 42 28 C42 36, 14 36, 14 28 Z" fill="#E31837"/>
      <circle cx="28" cy="28" r="8" fill="#FFFFFF"/>
      <circle cx="28" cy="28" r="4" fill="#00529B"/>
      <!-- Typography -->
      <text x="62" y="27" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#00529B" letter-spacing="1.5">HIGHNOON</text>
      <text x="63" y="44" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#E31837" letter-spacing="3">LABORATORIES</text>
    </g>
  </svg>`,

  "glitz": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Molecular Hexagon -->
      <polygon points="28,8 46,18 46,38 28,48 10,38 10,18" fill="#0EA5E9" opacity="0.15" stroke="#0284C7" stroke-width="2"/>
      <circle cx="28" cy="8" r="4" fill="#0284C7"/>
      <circle cx="46" cy="18" r="4" fill="#0284C7"/>
      <circle cx="46" cy="38" r="4" fill="#0284C7"/>
      <circle cx="28" cy="48" r="4" fill="#0284C7"/>
      <circle cx="10" cy="38" r="4" fill="#0284C7"/>
      <circle cx="10" cy="18" r="4" fill="#0284C7"/>
      <circle cx="28" cy="28" r="6" fill="#0369A1"/>
      <!-- Typography -->
      <text x="60" y="28" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#0F172A" letter-spacing="2">GLITZ</text>
      <text x="62" y="44" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#0284C7" letter-spacing="3.5">PHARMA</text>
    </g>
  </svg>`,

  "welmark": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Leaf Capsule -->
      <rect x="12" y="10" width="32" height="36" rx="16" fill="#059669"/>
      <path d="M12 28 H44" stroke="#FFFFFF" stroke-width="3"/>
      <path d="M28 14 C35 20, 35 36, 28 42" stroke="#A7F3D0" stroke-width="2" stroke-linecap="round"/>
      <!-- Typography -->
      <text x="56" y="27" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#064E3B" letter-spacing="1">WELMARK</text>
      <text x="57" y="43" font-family="Arial, Helvetica, sans-serif" font-size="9.5" font-weight="700" fill="#059669" letter-spacing="2.5">PHARMACEUTICALS</text>
    </g>
  </svg>`,

  "caraway": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Medical Cross & Swoosh -->
      <circle cx="28" cy="28" r="22" fill="#0072CE"/>
      <path d="M24 16 H32 V40 H24 Z M16 24 H40 V32 H16 Z" fill="#FFFFFF"/>
      <!-- Typography -->
      <text x="60" y="28" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#003A70" letter-spacing="1">CARAWAY</text>
      <text x="61" y="44" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" fill="#0072CE" letter-spacing="2.5">PHARMACEUTICALS</text>
    </g>
  </svg>`,

  "davis": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Caduceus Shield -->
      <path d="M28 8 L44 14 V28 C44 38, 28 48, 28 48 C28 48, 12 38, 12 28 V14 Z" fill="#6B21A8"/>
      <path d="M28 14 V40 M23 20 C33 22, 33 28, 23 30 C33 32, 33 38, 28 40" stroke="#E9D5FF" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <!-- Typography -->
      <text x="56" y="27" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" fill="#3B0764" letter-spacing="1">DAVIS</text>
      <text x="57" y="43" font-family="Arial, Helvetica, sans-serif" font-size="9.5" font-weight="700" fill="#7E22CE" letter-spacing="2">PHARMACEUTICALS</text>
    </g>
  </svg>`,

  "schazoo": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Classic Ophthalmic / Mortar Emblem -->
      <circle cx="28" cy="28" r="22" fill="#0891B2"/>
      <path d="M16 28 Q28 16 40 28 Q28 40 16 28 Z" fill="#FFFFFF"/>
      <circle cx="28" cy="28" r="5" fill="#0891B2"/>
      <!-- Typography -->
      <text x="58" y="26" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="#155E75" letter-spacing="1">THE SCHAZOO</text>
      <text x="59" y="42" font-family="Arial, Helvetica, sans-serif" font-size="9.5" font-weight="700" fill="#0891B2" letter-spacing="2.5">LABORATORIES</text>
    </g>
  </svg>`,

  "genetic": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- DNA Helix / Helix Circle -->
      <circle cx="28" cy="28" r="22" fill="#D97706"/>
      <path d="M20 16 Q28 28 36 40 M36 16 Q28 28 20 40" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      <!-- Typography -->
      <text x="58" y="27" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#78350F" letter-spacing="1">GENETIC</text>
      <text x="59" y="43" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#D97706" letter-spacing="3">PHARMA</text>
    </g>
  </svg>`,

  "zafa": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Red Cross & Z Emblem -->
      <rect x="8" y="8" width="40" height="40" rx="10" fill="#E11D48"/>
      <path d="M18 18 H38 L22 38 H38" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <!-- Typography -->
      <text x="58" y="28" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="900" fill="#881337" letter-spacing="2">ZAFA</text>
      <text x="59" y="44" font-family="Arial, Helvetica, sans-serif" font-size="9.5" font-weight="700" fill="#E11D48" letter-spacing="2">PHARMACEUTICALS</text>
    </g>
  </svg>`,

  "care_medical": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Surgical Instrument Badge -->
      <circle cx="28" cy="28" r="22" fill="#0072CE"/>
      <path d="M20 14 L36 42 M36 14 L20 42" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="20" cy="14" r="3" fill="#00A3E0"/>
      <circle cx="36" cy="14" r="3" fill="#00A3E0"/>
      <!-- Typography -->
      <text x="58" y="26" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="900" fill="#002D5C" letter-spacing="0.5">CARE MEDICAL</text>
      <text x="59" y="42" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" fill="#0072CE" letter-spacing="2">SURGICAL INSTRUMENTS</text>
    </g>
  </svg>`,

  "farhan": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <!-- Cotton Flower Shield -->
      <circle cx="28" cy="28" r="22" fill="#4B5563"/>
      <circle cx="24" cy="24" r="7" fill="#FFFFFF"/>
      <circle cx="32" cy="24" r="7" fill="#FFFFFF"/>
      <circle cx="28" cy="32" r="7" fill="#FFFFFF"/>
      <!-- Typography -->
      <text x="58" y="27" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" fill="#1F2937" letter-spacing="1">FARHAN</text>
      <text x="59" y="43" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="700" fill="#4B5563" letter-spacing="2">COTTON INDUSTRY</text>
    </g>
  </svg>`,

  "sayyed": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <circle cx="28" cy="28" r="22" fill="#1E40AF"/>
      <path d="M28 14 L32 24 L42 28 L32 32 L28 42 L24 32 L14 28 L24 24 Z" fill="#FFFFFF"/>
      <text x="58" y="27" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#1E3A8A" letter-spacing="1">SAYYED</text>
      <text x="59" y="43" font-family="Arial, Helvetica, sans-serif" font-size="10" font-weight="700" fill="#1E40AF" letter-spacing="3">PHARMA</text>
    </g>
  </svg>`,

  "macter": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80" fill="none">
    <rect width="300" height="80" rx="12" fill="#FFFFFF"/>
    <g transform="translate(15, 12)">
      <circle cx="28" cy="28" r="22" fill="#0D9488"/>
      <circle cx="28" cy="28" r="12" stroke="#FFFFFF" stroke-width="4" fill="none"/>
      <path d="M20 28 H36" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
      <text x="58" y="28" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900" fill="#115E59" letter-spacing="1.5">MACTER</text>
      <text x="59" y="44" font-family="Arial, Helvetica, sans-serif" font-size="9.5" font-weight="700" fill="#0D9488" letter-spacing="2.5">PHARMACEUTICALS</text>
    </g>
  </svg>`
};

for (const [key, svg] of Object.entries(logos)) {
  const filePath = path.join(brandsDir, `${key}.svg`);
  fs.writeFileSync(filePath, svg.trim(), 'utf-8');
  console.log(`✓ Generated brand logo: ${key}.svg`);
}

console.log('All brand logos generated successfully.');
