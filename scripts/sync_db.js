// scripts/sync_db.js
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

async function syncDb() {
  const host = process.env.DB_HOST || "srv2216.hstgr.io";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "u564667558_getbgdb";
  const password = process.env.DB_PASSWORD || "GetDBbiogen@026";
  const database = process.env.DB_NAME || "u564667558_getbgdb";

  console.log(`Connecting to Hostinger DB (${host}:${port}/${database})...`);

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

    // Sync categories
    const categoriesPath = path.join(__dirname, '..', 'src', 'cms', 'categories.json');
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = fs.readFileSync(categoriesPath, 'utf-8');
      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        ['categories', categoriesData]
      );
      console.log(`✓ Synced categories (with rich clinical department images) to database cms_store.`);
    }

    // Sync products
    const productsPath = path.join(__dirname, '..', 'src', 'cms', 'products.json');
    if (fs.existsSync(productsPath)) {
      const productsData = fs.readFileSync(productsPath, 'utf-8');
      const parsed = JSON.parse(productsData);
      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        ['products', productsData]
      );
      console.log(`✓ Synced ${parsed.length} products to database cms_store.`);
    }

    // Sync hero slides
    const heroPath = path.join(__dirname, '..', 'src', 'cms', 'hero-slides.json');
    if (fs.existsSync(heroPath)) {
      const heroData = fs.readFileSync(heroPath, 'utf-8');
      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        ['hero_slides', heroData]
      );
      console.log(`✓ Synced hero slides to database cms_store.`);
    }

    // Sync site config
    const configPath = path.join(__dirname, '..', 'src', 'cms', 'site-config.json');
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf-8');
      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        ['site_config', configData]
      );
      console.log(`✓ Synced site config to database cms_store.`);
    }

    // Sync pages config
    const pagesPath = path.join(__dirname, '..', 'src', 'cms', 'pages.json');
    if (fs.existsSync(pagesPath)) {
      const pagesData = fs.readFileSync(pagesPath, 'utf-8');
      await connection.query(
        `INSERT INTO cms_store (store_key, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        ['pages_config', pagesData]
      );
      console.log(`✓ Synced pages config to database cms_store.`);
    }

    await connection.end();
    console.log("\n✅ All CMS tables synchronized to Hostinger MySQL successfully!");
  } catch (err) {
    console.warn("DB sync warning:", err.message);
    console.log("Local JSON fallback mode is active.");
  }
}

syncDb();
