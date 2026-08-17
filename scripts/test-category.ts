import * as cheerio from 'cheerio';

async function testCategory() {
  try {
    const res = await fetch('https://www.khandryfruits.com/category/pistachios');
    const text = await res.text();
    const $ = cheerio.load(text);
    
    const products: any[] = [];
    $('.product-card, .product-item, div[class*="product"]').slice(0, 5).each((_, el) => {
      const title = $(el).find('h2, h3, .product-title, .title').text().trim();
      const href = $(el).find('a').attr('href');
      const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      const price = $(el).find('.price, .amount, .product-price').text().trim();
      
      if (title || href) {
        products.push({ title, href, img, price, htmlClass: $(el).attr('class') });
      }
    });
    console.log('Found products structure:', products);
  } catch (error) {
    console.error('Error:', error);
  }
}
testCategory();
