import * as cheerio from 'cheerio';
import { fetchMetadata } from './scraper';

async function searchGoogle(query) {
    try {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];

        // Parse organic results
        $('div.g').each((i, el) => {
            const link = $(el).find('a').attr('href');
            const title = $(el).find('h3').text();

            if (link && title && link.startsWith('http')) {
                results.push({ url: link, title });
            }
        });

        return results;
    } catch (error) {
        console.error('Google search error:', error);
        return [];
    }
}

async function searchDuckDuckGo(query) {
    try {
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const results = [];

        $('.result__a').each((i, el) => {
            const link = $(el).attr('href');
            const title = $(el).text();

            if (link) {
                let cleanLink = link;
                if (link.startsWith('//duckduckgo.com/l/')) {
                    const match = link.match(/uddg=([^&]+)/);
                    if (match && match[1]) {
                        cleanLink = decodeURIComponent(match[1]);
                    }
                }
                results.push({ url: cleanLink, title });
            }
        });

        return results;
    } catch (error) {
        console.error('DDG search error:', error);
        return [];
    }
}

export async function findCompetitors(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '');

        // Strategy: Search for "[domain] competitors"
        const query = `${domain} competitors`;

        // 1. Try Google first
        let competitors = await searchGoogle(query);

        // 2. Fallback to DuckDuckGo if Google fails or returns few results
        if (competitors.length < 3) {
            console.log('Google returned few results, falling back to DuckDuckGo...');
            const ddgResults = await searchDuckDuckGo(query);
            competitors = [...competitors, ...ddgResults];
        }

        // 3. Filter and Deduplicate
        const uniqueCompetitors = [];
        const seenDomains = new Set();
        seenDomains.add(domain); // Exclude own domain
        seenDomains.add('google.com');
        seenDomains.add('duckduckgo.com');
        seenDomains.add('youtube.com');
        seenDomains.add('facebook.com');
        seenDomains.add('twitter.com');
        seenDomains.add('linkedin.com');
        seenDomains.add('instagram.com');
        seenDomains.add('pinterest.com');
        seenDomains.add('reddit.com');
        seenDomains.add('quora.com');
        seenDomains.add('g2.com'); // Review sites often appear for "competitors" queries
        seenDomains.add('capterra.com');
        seenDomains.add('trustradius.com');
        seenDomains.add('getapp.com');
        seenDomains.add('softwareadvice.com');

        for (const comp of competitors) {
            try {
                const compDomain = new URL(comp.url).hostname.replace('www.', '');

                // Filter out review sites and social media to find actual product competitors
                // unless the user is actually searching for those.
                // For MVP, we'll filter common review aggregators to try and find direct competitors.

                if (!seenDomains.has(compDomain) && uniqueCompetitors.length < 5) {
                    seenDomains.add(compDomain);
                    uniqueCompetitors.push(comp);
                }
            } catch (e) {
                // Invalid URL
            }
        }

        return uniqueCompetitors;
    } catch (error) {
        console.error('Competitor finder error:', error);
        return { error: 'Internal server error during competitor search' };
    }
}
