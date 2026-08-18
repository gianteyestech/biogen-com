/**
 * CMS Library — server-side only.
 * Reads and writes CMS data to Hostinger MySQL database (with local JSON fallback).
 */
import "server-only";
import fs from "fs/promises";
import path from "path";
import pool from "./db";
import bcrypt from "bcryptjs";

// Re-export everything from cms-types for convenience in server code
export type {
  CMSProduct,
  CMSCategory,
  CMSCircleCat,
  CMSCategoriesFile,
  CMSHeroSlide,
  CMSPromoBanner,
  CMSTrustFeature,
  CMSSiteConfig,
  CMSPageSection,
  CMSPagesConfig,
  CMSActivityLog,
} from "./cms-types";
export { filterProductsByCategory, getSavePercent } from "./cms-types";

import type {
  CMSProduct,
  CMSCategoriesFile,
  CMSHeroSlide,
  CMSSiteConfig,
  CMSPagesConfig,
  CMSActivityLog,
} from "./cms-types";

// ─── Path helpers (Fallback) ──────────────────────────────────────────────────
const CMS_DIR = path.join(process.cwd(), "src", "cms");
const file = (name: string) => path.join(CMS_DIR, name);

async function readJsonFile<T>(filename: string): Promise<T> {
  const raw = await fs.readFile(file(filename), "utf-8");
  return JSON.parse(raw) as T;
}

// ─── Database helper functions ───────────────────────────────────────────────
// ─── Database helper functions ───────────────────────────────────────────────
let isTableInitialized = false;
let tableInitPromise: Promise<boolean> | null = null;
let isDbAvailable = true;
let lastDbErrorTime = 0;
const DB_RETRY_INTERVAL = 30000; // 30s cooldown before retrying DB after failure

function shouldTryDb(): boolean {
  if (isDbAvailable) return true;
  if (Date.now() - lastDbErrorTime > DB_RETRY_INTERVAL) {
    isDbAvailable = true;
    isTableInitialized = false;
    tableInitPromise = null;
    return true;
  }
  return false;
}

async function ensureTable(): Promise<boolean> {
  if (isTableInitialized) return true;
  if (!shouldTryDb()) return false;

  if (!tableInitPromise) {
    tableInitPromise = (async () => {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS cms_store (
            store_key VARCHAR(100) PRIMARY KEY,
            data LONGTEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(100) DEFAULT 'Admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS cms_activity_logs (
            id VARCHAR(100) PRIMARY KEY,
            action VARCHAR(50) NOT NULL,
            entity VARCHAR(50) NOT NULL,
            entity_id VARCHAR(255) NOT NULL,
            details TEXT NOT NULL,
            user VARCHAR(100) DEFAULT 'Admin',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS chat_threads (
            id VARCHAR(100) PRIMARY KEY,
            session_id VARCHAR(100) NOT NULL UNIQUE,
            customer_name VARCHAR(150) NOT NULL,
            customer_email VARCHAR(255) DEFAULT '',
            status VARCHAR(30) DEFAULT 'active',
            last_message TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS chat_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            thread_id VARCHAR(100) NOT NULL,
            sender VARCHAR(30) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_thread (thread_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        await pool.query(`
          CREATE TABLE IF NOT EXISTS password_resets (
            token VARCHAR(100) PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            expires BIGINT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        isTableInitialized = true;
        isDbAvailable = true;
        return true;
      } catch (err: any) {
        if (isDbAvailable) {
          console.warn(
            `[CMS] Hostinger MySQL database unavailable (${err.code || err.message}). Operating in local JSON fallback mode.`
          );
        }
        isDbAvailable = false;
        lastDbErrorTime = Date.now();
        return false;
      } finally {
        tableInitPromise = null;
      }
    })();
  }

  return tableInitPromise;
}

async function getStoreData<T>(key: string, fallbackFile: string): Promise<T> {
  const dbOk = await ensureTable();
  if (dbOk && isDbAvailable) {
    let retries = 3;
    while (retries > 0) {
      try {
        const [rows] = await pool.query<any[]>(
          "SELECT data FROM cms_store WHERE store_key = ?",
          [key]
        );
        if (rows && rows.length > 0) {
          return JSON.parse(rows[0].data) as T;
        }
        break; // Row not found, break to fallback
      } catch (err: any) {
        retries--;
        if (retries === 0) {
          console.error(`[CMS] Hostinger DB read failed for key "${key}" after 3 retries:`, err.message || err);
          isDbAvailable = false;
          lastDbErrorTime = Date.now();
        } else {
          // Wait 150ms before retrying
          await new Promise((r) => setTimeout(r, 150));
        }
      }
    }
  }

  // Fallback to local JSON file only if DB row does not exist or DB connection completely down
  try {
    const localData = await readJsonFile<T>(fallbackFile);
    return localData;
  } catch {
    return [] as unknown as T;
  }
}

async function saveStoreData<T>(key: string, data: T): Promise<void> {
  const dbOk = await ensureTable();
  const jsonString = JSON.stringify(data);

  if (dbOk && isDbAvailable) {
    try {
      await pool.query(
        `INSERT INTO cms_store (store_key, data) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE data = VALUES(data)`,
        [key, jsonString]
      );
    } catch (err: any) {
      console.error(`[CMS] Hostinger DB write failed for key "${key}":`, err.message || err);
      isDbAvailable = false;
      lastDbErrorTime = Date.now();
    }
  }

  // Always update local JSON file
  try {
    const filename = key.replace("_", "-") + ".json";
    await fs.writeFile(file(filename), JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

// ─── Read functions ───────────────────────────────────────────────────────────
export async function getCMSProducts(): Promise<CMSProduct[]> {
  return getStoreData<CMSProduct[]>("products", "products.json");
}

export async function getCMSProduct(id: string): Promise<CMSProduct | undefined> {
  const products = await getCMSProducts();
  return products.find((p) => p.id === id);
}

export async function getCMSCategories(): Promise<CMSCategoriesFile> {
  return getStoreData<CMSCategoriesFile>("categories", "categories.json");
}

export async function getCMSHeroSlides(): Promise<CMSHeroSlide[]> {
  return getStoreData<CMSHeroSlide[]>("hero_slides", "hero-slides.json");
}

export async function getCMSSiteConfig(): Promise<CMSSiteConfig> {
  const config = await getStoreData<CMSSiteConfig>("site_config", "site-config.json");
  // ── Backward-compatibility migration ─────────────────────────────────────
  // If the DB row predates the paymentMethods field, inject defaults from the
  // local JSON file and persist the updated config back to the DB.
  if (!config.paymentMethods) {
    try {
      const defaultCfg = await readJsonFile<CMSSiteConfig>("site-config.json");
      config.paymentMethods = defaultCfg.paymentMethods ?? [];
    } catch {
      config.paymentMethods = [];
    }
    saveStoreData("site_config", config).catch(() => {});
  }
  return config;
}

export async function getCMSPagesConfig(): Promise<CMSPagesConfig> {
  const pagesConfig = await getStoreData<CMSPagesConfig>("pages", "pages.json");
  if (pagesConfig && pagesConfig.sections) {
    const hasTrust = pagesConfig.sections.some((s) => s.type === "trust-features" || s.id === "trust-features-bar");
    if (!hasTrust) {
      pagesConfig.sections.push({
        id: "trust-features-bar",
        title: "Trust Features Bar",
        type: "trust-features",
        categoryId: "",
        visible: true,
        order: pagesConfig.sections.length + 1,
      });
      saveStoreData("pages", pagesConfig).catch(() => {});
    }
  }
  return pagesConfig;
}

// ─── Activity Log helper & getter ─────────────────────────────────────────────
export async function logActivity(
  action: "CREATE" | "UPDATE" | "DELETE",
  entity: "Product" | "Category" | "HeroSlide" | "PaymentMethod" | "SiteConfig" | "PagesConfig",
  entityId: string,
  details: string,
  user: string = "Admin"
): Promise<void> {
  const logItem: CMSActivityLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
    user,
  };

  const dbOk = await ensureTable();
  if (dbOk && isDbAvailable) {
    try {
      await pool.query(
        `INSERT INTO cms_activity_logs (id, action, entity, entity_id, details, user)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [logItem.id, logItem.action, logItem.entity, logItem.entityId, logItem.details, logItem.user]
      );
    } catch (err: any) {
      console.error("[CMS Log] Hostinger DB log write failed:", err.message || err);
    }
  }

  // Fallback to local file log store
  try {
    const existingLogs: CMSActivityLog[] = await getStoreData<CMSActivityLog[]>("activity_logs", "activity-logs.json").catch(() => []);
    existingLogs.unshift(logItem);
    // Keep last 500 logs
    const trimmed = existingLogs.slice(0, 500);
    await fs.writeFile(file("activity-logs.json"), JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {}
}

export async function getCMSActivityLogs(limit: number = 100): Promise<CMSActivityLog[]> {
  const dbOk = await ensureTable();
  if (dbOk && isDbAvailable) {
    try {
      const [rows] = await pool.query<any[]>(
        "SELECT id, action, entity, entity_id as entityId, details, user, created_at as timestamp FROM cms_activity_logs ORDER BY created_at DESC LIMIT ?",
        [limit]
      );
      if (rows && rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          action: r.action,
          entity: r.entity,
          entityId: r.entityId,
          details: r.details,
          timestamp: new Date(r.timestamp).toISOString(),
          user: r.user || "Admin",
        }));
      }
    } catch (err: any) {
      console.warn("[CMS Log] DB read failed, falling back to local file log:", err.message || err);
    }
  }

  try {
    const logs = await readJsonFile<CMSActivityLog[]>("activity-logs.json");
    return logs.slice(0, limit);
  } catch {
    return [];
  }
}

// ─── Product write functions ──────────────────────────────────────────────────
export async function createCMSProduct(product: CMSProduct): Promise<void> {
  const products = await getCMSProducts();
  if (products.find((p) => p.id === product.id)) {
    throw new Error(`Product with id "${product.id}" already exists.`);
  }
  products.push(product);
  await saveStoreData("products", products);
  await logActivity("CREATE", "Product", product.id, `Created product "${product.name}"`);
}

export async function updateCMSProduct(id: string, updates: Partial<CMSProduct>): Promise<void> {
  const products = await getCMSProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Product "${id}" not found.`);
  products[idx] = { ...products[idx], ...updates };
  await saveStoreData("products", products);
  await logActivity("UPDATE", "Product", id, `Updated product "${products[idx].name || id}"`);
}

export async function deleteCMSProduct(id: string): Promise<void> {
  const products = await getCMSProducts();
  const target = products.find((p) => p.id === id);
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) throw new Error(`Product "${id}" not found.`);
  await saveStoreData("products", filtered);
  await logActivity("DELETE", "Product", id, `Deleted product "${target?.name || id}"`);
}

// ─── Category write functions ─────────────────────────────────────────────────
export async function updateCMSCategories(data: CMSCategoriesFile): Promise<void> {
  await saveStoreData("categories", data);
  await logActivity("UPDATE", "Category", "categories_all", `Updated site categories structure`);
}

// ─── Hero slide write functions ───────────────────────────────────────────────
export async function updateCMSHeroSlides(slides: CMSHeroSlide[]): Promise<void> {
  await saveStoreData("hero_slides", slides);
  await logActivity("UPDATE", "HeroSlide", "hero_slides_all", `Updated hero carousel slides (${slides.length} slides)`);
}

// ─── Site config write function ───────────────────────────────────────────────
export async function updateCMSSiteConfig(config: CMSSiteConfig): Promise<void> {
  await saveStoreData("site_config", config);
  await logActivity("UPDATE", "SiteConfig", "site_config_all", `Updated global site configuration & branding`);
}

// ─── Pages config write function ─────────────────────────────────────────────
export async function updateCMSPagesConfig(config: CMSPagesConfig): Promise<void> {
  await saveStoreData("pages", config);
  await logActivity("UPDATE", "PagesConfig", "pages_config_all", `Updated homepage page sections layout`);
}

// ─── Admin Users Database Auth ───────────────────────────────────────────────
export async function verifyAdminCredentials(passwordInput: string): Promise<boolean> {
  const defaultAdminPass = process.env.ADMIN_PASSWORD || "admin1234";

  const dbOk = await ensureTable();
  if (!dbOk || !isDbAvailable) {
    // Fallback to environment variable if DB unavailable
    return passwordInput === defaultAdminPass;
  }

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT password_hash FROM admin_users ORDER BY id ASC LIMIT 1"
    );

    if (!rows || rows.length === 0) {
      // Seed default admin user into DB if empty
      const defaultHash = await bcrypt.hash(defaultAdminPass, 10);
      const defaultEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";
      await pool.query(
        "INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)",
        [defaultEmail, defaultHash, "Super Admin"]
      );
      return passwordInput === defaultAdminPass;
    }

    const storedHash = rows[0].password_hash;
    return await bcrypt.compare(passwordInput, storedHash);
  } catch (err: any) {
    console.error("[CMS Auth] DB check failed, using env fallback:", err.message);
    return passwordInput === defaultAdminPass;
  }
}

export async function updateAdminPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const isValid = await verifyAdminCredentials(currentPassword);
  if (!isValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }

  const dbOk = await ensureTable();
  if (!dbOk || !isDbAvailable) {
    return { success: false, message: "Database unavailable. Cannot update password in fallback mode." };
  }

  try {
    const newHash = await bcrypt.hash(newPassword, 10);
    const [rows] = await pool.query<any[]>("SELECT id FROM admin_users ORDER BY id ASC LIMIT 1");
    
    if (rows && rows.length > 0) {
      await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [newHash, rows[0].id]);
    } else {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";
      await pool.query("INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)", [
        defaultEmail,
        newHash,
        "Super Admin"
      ]);
    }

    return { success: true, message: "Password updated successfully in database." };
  } catch (err: any) {
    console.error("[CMS Auth] Failed to update password:", err);
    return { success: false, message: err.message || "Failed to update password." };
  }
}

export async function resetAdminPasswordDirect(newPassword: string): Promise<{ success: boolean; message: string }> {
  if (newPassword.length < 6) {
    return { success: false, message: "New password must be at least 6 characters long." };
  }

  const dbOk = await ensureTable();
  if (!dbOk || !isDbAvailable) {
    return { success: false, message: "Database unavailable." };
  }

  try {
    const newHash = await bcrypt.hash(newPassword, 10);
    const [rows] = await pool.query<any[]>("SELECT id FROM admin_users ORDER BY id ASC LIMIT 1");

    if (rows && rows.length > 0) {
      await pool.query("UPDATE admin_users SET password_hash = ? WHERE id = ?", [newHash, rows[0].id]);
    } else {
      const defaultEmail = process.env.ADMIN_EMAIL || "admin.biogen@gianteyetech.com";
      await pool.query("INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)", [
        defaultEmail,
        newHash,
        "Super Admin",
      ]);
    }

    return { success: true, message: "Password reset successfully!" };
  } catch (err: any) {
    console.error("[CMS Auth] Failed to reset password:", err);
    return { success: false, message: err.message || "Failed to reset password." };
  }
}

export async function savePasswordResetToken(token: string, email: string, expires: number): Promise<boolean> {
  const dbOk = await ensureTable();
  if (!dbOk || !isDbAvailable) return false;
  try {
    await pool.query(
      "INSERT INTO password_resets (token, email, expires) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE expires = VALUES(expires)",
      [token, email, expires]
    );
    return true;
  } catch (err) {
    console.error("[CMS Auth] Failed to save reset token:", err);
    return false;
  }
}

export async function verifyAndConsumeResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
  const dbOk = await ensureTable();
  if (!dbOk || !isDbAvailable) return { valid: false };
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM password_resets WHERE token = ?", [token]);
    if (!rows || rows.length === 0) {
      return { valid: false };
    }
    const tokenRecord = rows[0];
    if (Date.now() > Number(tokenRecord.expires)) {
      await pool.query("DELETE FROM password_resets WHERE token = ?", [token]);
      return { valid: false };
    }
    // Delete once verified/consumed
    await pool.query("DELETE FROM password_resets WHERE token = ?", [token]);
    return { valid: true, email: tokenRecord.email };
  } catch (err) {
    console.error("[CMS Auth] Failed to verify reset token:", err);
    return { valid: false };
  }
}

// ─── Live Chat Database Functions ─────────────────────────────────────────────
export async function getOrCreateChatThread(sessionId: string, customerName?: string, customerEmail?: string) {
  await ensureTable();
  const [rows] = await pool.query<any[]>("SELECT * FROM chat_threads WHERE session_id = ?", [sessionId]);
  if (rows && rows.length > 0) {
    return rows[0];
  }

  const threadId = `th_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const name = customerName || `Guest ${sessionId.substring(0, 5)}`;
  const email = customerEmail || "";

  await pool.query(
    "INSERT INTO chat_threads (id, session_id, customer_name, customer_email, status) VALUES (?, ?, ?, ?, 'active')",
    [threadId, sessionId, name, email]
  );

  return { id: threadId, session_id: sessionId, customer_name: name, customer_email: email, status: "active" };
}

export async function sendChatMessage(threadId: string, sender: "customer" | "admin", message: string) {
  await ensureTable();
  await pool.query("INSERT INTO chat_messages (thread_id, sender, message) VALUES (?, ?, ?)", [
    threadId,
    sender,
    message,
  ]);
  await pool.query("UPDATE chat_threads SET last_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
    message,
    threadId,
  ]);
}

export async function getChatMessages(threadId: string) {
  await ensureTable();
  const [rows] = await pool.query<any[]>(
    "SELECT id, sender, message, created_at as timestamp FROM chat_messages WHERE thread_id = ? ORDER BY created_at ASC",
    [threadId]
  );
  return rows || [];
}

export async function getAdminChatThreads() {
  await ensureTable();
  const [rows] = await pool.query<any[]>(
    "SELECT id, session_id, customer_name, customer_email, status, last_message, updated_at FROM chat_threads ORDER BY updated_at DESC LIMIT 50"
  );
  return rows || [];
}


