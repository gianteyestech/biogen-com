const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'scratch', 'Gallery');
const teamDir = path.join(__dirname, '..', 'public', 'images', 'team');
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

[teamDir, galleryDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function processGallery() {
  console.log('Processing Executive Team & Corporate Gallery images...');

  // 1. Executive Team
  const teamMap = [
    {
      src: 'CEO Muhammad Rizwan.png',
      dest: path.join(teamDir, 'ceo_muhammad_rizwan.webp'),
      name: 'Muhammad Rizwan',
      role: 'Chief Executive Officer (CEO)',
      bio: 'Visionary healthcare leader steering Biogen Pharma’s global pharmaceutical and surgical distribution across international hospital networks.'
    },
    {
      src: 'Muhammad Shahid - Managing Director.jpeg',
      dest: path.join(teamDir, 'md_muhammad_shahid.webp'),
      name: 'Muhammad Shahid',
      role: 'Managing Director',
      bio: 'Directing strategic manufacturing partnerships, institutional tender compliance, and regulatory cGMP certifications.'
    },
    {
      src: 'M.Bilal Shabir (Operations Manager).jpeg',
      dest: path.join(teamDir, 'ops_bilal_shabir.webp'),
      name: 'M. Bilal Shabir',
      role: 'Operations & Supply Chain Manager',
      bio: 'Leading end-to-end cold-chain logistics, warehouse quality assurance, and institutional dispatch operations.'
    }
  ];

  for (const member of teamMap) {
    const srcPath = path.join(srcDir, member.src);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(800, 1000, { fit: 'cover', position: 'top' })
        .webp({ quality: 90 })
        .toFile(member.dest);
      console.log(`✓ Processed Team: ${member.name} -> ${member.dest}`);
    } else {
      console.warn(`! Missing file: ${srcPath}`);
    }
  }

  // 2. Corporate Events, MOUs, Awards, Plant Visits
  const galleryFiles = fs.readdirSync(srcDir).filter(f => f.startsWith('WhatsApp Image'));
  const galleryItems = [];

  const categoryCaptions = [
    { title: 'B2B Strategic Partnership & MOU Signing Ceremony', category: 'MOUs & Partnerships', badge: 'Strategic Alliance' },
    { title: 'National Healthcare Excellence & Distribution Award', category: 'Awards & Honors', badge: 'Award 2026' },
    { title: 'International Pharmaceutical Delegation & Trade Assembly', category: 'Delegations', badge: 'Global Summit' },
    { title: 'State-of-the-Art cGMP Manufacturing Facility Inspection', category: 'Plant & Facilities', badge: 'cGMP Audit' },
    { title: 'Hospital Procurement & Institutional Supply Council Meeting', category: 'MOUs & Partnerships', badge: 'Procurement' },
    { title: 'Global Medical Devices & Surgical Technology Showcase', category: 'Exhibitions', badge: 'Technology' },
    { title: 'Quality Assurance & Cold-Chain Warehouse Certification Audit', category: 'Plant & Facilities', badge: 'QA Standards' },
    { title: 'Executive Board & Principal Laboratory Review Convention', category: 'Leadership', badge: 'Board Summit' },
    { title: 'Government Health Regulatory Delegation Facility Review', category: 'Delegations', badge: 'Regulatory' },
  ];

  for (let i = 0; i < galleryFiles.length; i++) {
    const file = galleryFiles[i];
    const srcPath = path.join(srcDir, file);
    const cleanFileName = `gallery_event_${i + 1}.webp`;
    const destPath = path.join(galleryDir, cleanFileName);

    await sharp(srcPath)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(destPath);

    const meta = categoryCaptions[i % categoryCaptions.length];
    galleryItems.push({
      id: `gallery-item-${i + 1}`,
      title: meta.title,
      category: meta.category,
      badge: meta.badge,
      imageUrl: `/images/gallery/${cleanFileName}`,
      aspectRatio: 'landscape'
    });

    console.log(`✓ Processed Gallery ${i + 1}: ${cleanFileName}`);
  }

  // Save gallery JSON for CMS & About Us page
  const galleryJsonPath = path.join(__dirname, '..', 'src', 'cms', 'gallery.json');
  fs.writeFileSync(galleryJsonPath, JSON.stringify({ team: teamMap.map(t => ({
    name: t.name,
    role: t.role,
    bio: t.bio,
    imageUrl: `/images/team/${path.basename(t.dest)}`
  })), gallery: galleryItems }, null, 2));

  console.log(`Saved gallery.json with ${galleryItems.length} events and ${teamMap.length} executive leaders.`);
}

processGallery().catch(console.error);
