import { NextResponse } from 'next/server';
import { fetchMetadata } from '@/lib/scraper';
import { calculateScore, compareSEO } from '@/lib/analyzer';
import { fetchLighthouseScores } from '@/lib/lighthouse';

export async function POST(request) {
    try {
        const { myUrl, competitors } = await request.json();

        if (!myUrl || !competitors || !Array.isArray(competitors) || competitors.length === 0) {
            return NextResponse.json({ error: 'Missing URL or competitors' }, { status: 400 });
        }

        // 1. Fetch My Data
        const [myMetadata, myLighthouse] = await Promise.all([
            fetchMetadata(myUrl),
            fetchLighthouseScores(myUrl)
        ]);

        if (myMetadata.error) {
            return NextResponse.json({ error: `Failed to fetch your URL: ${myMetadata.error}` }, { status: 422 });
        }

        const myScore = calculateScore(myMetadata);

        // 2. Fetch Competitors Data in Parallel
        const competitorsResults = await Promise.all(
            competitors.map(async (url) => {
                if (!url) return null;
                const [meta, lighthouse] = await Promise.all([
                    fetchMetadata(url),
                    fetchLighthouseScores(url)
                ]);

                if (meta.error) return { url, error: meta.error };

                const score = calculateScore(meta);
                const comparison = compareSEO(myMetadata, meta);

                return {
                    url,
                    data: meta,
                    score,
                    lighthouse,
                    comparison
                };
            })
        );

        // Filter out failed fetches if any (or handle them gracefully in UI)
        const validCompetitors = competitorsResults.filter(c => c !== null);

        return NextResponse.json({
            myData: {
                url: myUrl,
                ...myMetadata,
                score: myScore,
                lighthouse: myLighthouse
            },
            competitors: validCompetitors
        });

    } catch (error) {
        console.error('Analysis error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
