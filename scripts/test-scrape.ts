import * as cheerio from 'cheerio';

async function testFetch() {
  try {
    const res = await fetch('https://www.khandryfruits.com/');
    const text = await res.text();
    const $ = cheerio.load(text);
    const title = $('title').text();
    console.log('Title:', title);
    
    // Find category links
    const categoryLinks = new Set<string>();
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/category/')) {
        categoryLinks.add(href);
      }
    });
    console.log('Categories:', Array.from(categoryLinks));
    
    // Find product links
    const productLinks = new Set<string>();
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/product/')) {
        productLinks.add(href);
      }
    });
    console.log('Products:', Array.from(productLinks).slice(0, 5)); // show a few
  } catch (error) {
    console.error('Error fetching:', error);
  }
}

testFetch();
