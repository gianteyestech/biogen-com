// scripts/backup_from_db.js
/**
 * BACKUP LIVE DATA FROM HOSTINGER MYSQL -> LOCAL REPO FILES
 * 
 * Run this command anytime you want to snapshot the live client data
 * from Hostinger MySQL into your local Git working copy.
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
      process.env[match[1]] = val;
    }
  });
}

const KEY_TO_FILE = {
  categories: 'src/cms/categories.json',
  products: 'src/cms/products.json',
  hero_slides: 'src/cms/hero-slides.json',
  site_config: 'src/cms/site-config.json',
  pages: 'src/cms/pages.json',
  brand_partners: 'src/cms/brand-partners.json',
  gallery: 'src/cms/gallery.json',
  faqs: 'src/cms/faqs.json',
  policies: 'src/cms/policies.json',
  about_content: 'src/cms/about-content.json',
};

async function backup() {
  const host = process.env.DB_HOST || "srv2216.hstgr.io";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "u564667558_getbgdb";
  const password = process.env.DB_PASSWORD || "GetDBbiogen@026";
  const database = process.env.DB_NAME || "u564667558_getbgdb";

  console.log(`\nConnecting to Hostinger DB (${host}:${port}/${database})...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      connectTimeout: 10000,
      ssl: { rejectUnauthorized: false }
    });

    console.log("✓ Connected to Hostinger DB!");

    const [rows] = await connection.query('SELECT store_key, data FROM cms_store');
    console.log(`Found ${rows.length} store items in database.\n`);

    for (const row of rows) {
      const targetRelPath = KEY_TO_FILE[row.store_key];
      if (targetRelPath) {
        const fullPath = path.join(__dirname, '..', targetRelPath);
        try {
          // Format prettified JSON
          const parsed = JSON.parse(row.data);
          fs.writeFileSync(fullPath, JSON.stringify(parsed, null, 2), 'utf-8');
          console.log(`✓ Backed up "${row.store_key}" -> ${targetRelPath}`);
        } catch (e) {
          fs.writeFileSync(fullPath, row.data, 'utf-8');
          console.log(`✓ Backed up raw "${row.store_key}" -> ${targetRelPath}`);
        }
      }
    }

    await connection.end();
    console.log("\n🎉 Live database content successfully backed up to local files!");
  } catch (err) {
    console.error("Backup failed:", err.message);
  }
}

backup();
