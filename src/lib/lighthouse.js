export async function fetchLighthouseScores(url) {
    try {
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.warn(`Lighthouse API failed for ${url}: ${response.statusText}`);
            // Fallback for demo/MVP if rate limited
            if (response.status === 429) {
                console.log('Returning mock Lighthouse data for demo purposes.');
                return null;
            }
            return null;
        }

        const data = await response.json();
        const lighthouseResult = data.lighthouseResult;

        if (!lighthouseResult) return null;

        return {
            performance: Math.round((lighthouseResult.categories.performance?.score || 0) * 100),
            accessibility: Math.round((lighthouseResult.categories.accessibility?.score || 0) * 100),
            bestPractices: Math.round((lighthouseResult.categories['best-practices']?.score || 0) * 100),
            seo: Math.round((lighthouseResult.categories.seo?.score || 0) * 100),
        };
    } catch (error) {
        console.error('Lighthouse fetch error:', error);
        return null;
    }
}
