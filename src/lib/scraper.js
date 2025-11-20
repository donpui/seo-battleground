import * as cheerio from 'cheerio';

export async function fetchMetadata(url) {
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOComparisonBot/1.0; +http://localhost:3000)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      url,
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      h1: $('h1').map((i, el) => $(el).text().trim()).get(),
      h2: $('h2').map((i, el) => $(el).text().trim()).get(),
      images: $('img').map((i, el) => ({
        src: $(el).attr('src'),
        alt: $(el).attr('alt') || '',
      })).get(),
      canonical: $('link[rel="canonical"]').attr('href') || '',
      robots: $('meta[name="robots"]').attr('content') || '',
      og: {
        title: $('meta[property="og:title"]').attr('content') || '',
        description: $('meta[property="og:description"]').attr('content') || '',
        image: $('meta[property="og:image"]').attr('content') ||
          $('meta[property="og:image:secure_url"]').attr('content') || '',
        url: $('meta[property="og:url"]').attr('content') || '',
      },
      twitter: {
        card: $('meta[name="twitter:card"]').attr('content') ||
          $('meta[property="twitter:card"]').attr('content') || '',
        title: $('meta[name="twitter:title"]').attr('content') ||
          $('meta[property="twitter:title"]').attr('content') || '',
        description: $('meta[name="twitter:description"]').attr('content') ||
          $('meta[property="twitter:description"]').attr('content') || '',
        image: $('meta[name="twitter:image"]').attr('content') ||
          $('meta[property="twitter:image"]').attr('content') || '',
      },
      jsonLd: $('script[type="application/ld+json"]').length > 0,
      wordCount: $('body').text().trim().split(/\s+/).length,
    };

    return data;
  } catch (error) {
    console.error('Scraping error:', error);
    return { error: error.message };
  }
}
