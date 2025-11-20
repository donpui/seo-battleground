import { NextResponse } from 'next/server';
import { findCompetitors } from '@/lib/competitor-finder';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const competitors = await findCompetitors(url);

        if (competitors.error) {
            return NextResponse.json({ error: competitors.error }, { status: 422 });
        }

        return NextResponse.json({ competitors });
    } catch (error) {
        console.error('Competitor API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
