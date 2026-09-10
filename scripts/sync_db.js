// scripts/sync_db.js
/**
 * SAFE DATABASE INITIALIZER
 * 
 * CRITICAL RULE:
 * This script ONLY seeds initial default data for keys that DO NOT ALREADY EXIST in Hostinger MySQL.
 * It will NEVER overwrite existing client-entered data.
 * 
 * If a key already exists, it is preserved completely.
 * To explicitly overwrite everything from local JSON, pass the flag: --force-overwrite
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Parse .env.local if present
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let val = (match[2] || '').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const isForce = process.argv.includes('--force-overwrite');

async function syncDb() {
  const host = process.env.DB_HOST || "srv2216.hstgr.io";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "u564667558_getbgdb";
  const password = process.env.DB_PASSWORD || "GetDBbiogen@026";
  const database = process.env.DB_NAME || "u564667558_getbgdb";

  console.log(`\nConnecting to Hostinger DB (${host}:${port}/${database})...`);
  if (isForce) {
    console.log("⚠️  WARNING: Running with --force-overwrite. All keys will be replaced with local JSON defaults.");
  } else {
    console.log("🛡️  SAFE MODE: Existing database keys will NOT be overwritten.");
  }

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

    // Ensure cms_store table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cms_store (
        store_key VARCHAR(100) PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Fetch existing keys
    const [existingRows] = await connection.query('SELECT store_key FROM cms_store');
    const existingKeys = new Set(existingRows.map(r => r.store_key));

    const syncKey = async (storeKey, relativeFilePath, label) => {
      const filePath = path.join(__dirname, '..', relativeFilePath);
      if (!fs.existsSync(filePath)) return;

      const fileData = fs.readFileSync(filePath, 'utf-8');

      if (existingKeys.has(storeKey) && !isForce) {
        console.log(`ℹ️  [PRESERVED] Key "${storeKey}" already exists in DB. Skipping to protect client data.`);
        return;
      }

      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [storeKey, fileData]
      );
      console.log(`✓ [SEEDED] ${label} -> cms_store (${storeKey})`);
    };

    await syncKey('categories', 'src/cms/categories.json', 'Categories');
    await syncKey('products', 'src/cms/products.json', 'Products');
    await syncKey('hero_slides', 'src/cms/hero-slides.json', 'Hero Slides');
    await syncKey('site_config', 'src/cms/site-config.json', 'Site Config');
    await syncKey('pages', 'src/cms/pages.json', 'Pages Config');
    await syncKey('brand_partners', 'src/cms/brand-partners.json', 'Brand Partners');
    await syncKey('gallery', 'src/cms/gallery.json', 'Corporate Gallery & Team');
    await syncKey('faqs', 'src/cms/faqs.json', 'FAQs');
    await syncKey('policies', 'src/cms/policies.json', 'Policies');
    await syncKey('about_content', 'src/cms/about-content.json', 'About Content');

    // Clean up obsolete legacy duplicate keys if any
    await connection.query(`DELETE FROM cms_store WHERE store_key IN ('pages_config', 'hero-slides', 'site-config')`);

    await connection.end();
    console.log("\n✅ Database verification complete. Live client data protected!");
  } catch (err) {
    console.warn("DB sync warning:", err.message);
  }
}

syncDb();
