import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

// This script provides a baseline to scrape categories and products from khandryfruits.com
// Since full scraping can take a long time and might hit rate limits, this script can be extended 
// to iterate slowly and save progress.

async function scrapeKhandryFruits() {
  console.log("Starting scrape...");
  try {
    const res = await fetch('https://www.khandryfruits.com/');
    const text = await res.text();
    const $ = cheerio.load(text);
    
    // 1. Gather Categories
    const categoryLinks = new Set<string>();
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/category/')) {
        categoryLinks.add(href);
      }
    });

    console.log(`Found ${categoryLinks.size} categories.`);
    
    // In a real run, you would map over categoryLinks:
    // for (const catUrl of categoryLinks) {
    //   const catRes = await fetch(catUrl);
    //   // parse products on the category page
    // }

    // Dummy product output structure to match products.json
    const scrapedProducts = [];
    
    // Parse homepage products as a quick test
    $('.product-card, .product-item, div[class*="product"]').each((_, el) => {
      const title = $(el).find('h2, h3, .product-title, .title').text().trim();
      const href = $(el).find('a').attr('href');
      const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      let priceText = $(el).find('.price, .amount, .product-price').text().trim();
      
      if (title && href && img) {
        // Create an ID from the title
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Clean price
        priceText = priceText.replace(/[^\d]/g, '');
        const priceNum = parseInt(priceText, 10) || 0;
        
        scrapedProducts.push({
          id,
          name: title,
          urduName: "",
          category: "scraped",
          subCategory: "",
          description: "Scraped from khandryfruits.com",
          rating: 4.5,
          reviewsCount: 0,
          imageUrl: img,
          prices: { "250g": priceNum },
          originalPrices: {},
          inStock: true,
          featured: false,
          isNew: true,
          badge: ""
        });
      }
    });
    
    console.log(`Scraped ${scrapedProducts.length} products from homepage.`);
    
    // If you wish to save this to products.json, you would load the existing file,
    // merge the arrays, and rewrite the file.
    // const productsPath = path.join(__dirname, '../src/cms/products.json');
    // const existing = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    // fs.writeFileSync(productsPath, JSON.stringify([...existing, ...scrapedProducts], null, 2));

    console.log("Scrape pipeline script ready for full execution.");
  } catch (error) {
    console.error('Error fetching:', error);
  }
}

scrapeKhandryFruits();
