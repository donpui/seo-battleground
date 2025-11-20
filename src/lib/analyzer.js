function calculateJaccardIndex(str1, str2) {
    if (!str1 || !str2) return 0;
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return Math.round((intersection.size / union.size) * 100);
}

export function compareSEO(data1, data2) {
    const comparison = {
        title: {
            diff: data1.title !== data2.title,
            missing1: !data1.title,
            missing2: !data2.title,
            length1: data1.title.length,
            length2: data2.title.length,
        },
        description: {
            diff: data1.description !== data2.description,
            missing1: !data1.description,
            missing2: !data2.description,
            length1: data1.description.length,
            length2: data2.description.length,
            similarity: calculateJaccardIndex(data1.description, data2.description),
        },
        h1: {
            count1: data1.h1.length,
            count2: data2.h1.length,
            missing1: data1.h1.length === 0,
            missing2: data2.h1.length === 0,
        },
        images: {
            count1: data1.images.length,
            count2: data2.images.length,
            missingAlt1: data1.images.filter(img => !img.alt).length,
            missingAlt2: data2.images.filter(img => !img.alt).length,
        },
        og: {
            missing1: !data1.og.title || !data1.og.image,
            missing2: !data2.og.title || !data2.og.image,
            title: { val1: data1.og.title, val2: data2.og.title, match: data1.og.title === data2.og.title },
            description: { val1: data1.og.description, val2: data2.og.description, match: data1.og.description === data2.og.description },
            image: { val1: data1.og.image, val2: data2.og.image, match: data1.og.image === data2.og.image },
            url: { val1: data1.og.url, val2: data2.og.url, match: data1.og.url === data2.og.url },
        },
        twitter: {
            card: { val1: data1.twitter.card, val2: data2.twitter.card, match: data1.twitter.card === data2.twitter.card },
            title: { val1: data1.twitter.title, val2: data2.twitter.title, match: data1.twitter.title === data2.twitter.title },
            description: { val1: data1.twitter.description, val2: data2.twitter.description, match: data1.twitter.description === data2.twitter.description },
            image: { val1: data1.twitter.image, val2: data2.twitter.image, match: data1.twitter.image === data2.twitter.image },
        },
        wordCount: {
            count1: data1.wordCount,
            count2: data2.wordCount,
            diff: Math.abs(data1.wordCount - data2.wordCount),
        }
    };
    return comparison;
}

export function calculateScore(data) {
    let score = 100;
    const deductions = [];

    // Title
    if (!data.title) {
        score -= 20;
        deductions.push('Missing Title Tag');
    } else if (data.title.length < 30 || data.title.length > 60) {
        score -= 5;
        deductions.push('Title length not optimal (30-60 chars)');
    }

    // Description
    if (!data.description) {
        score -= 20;
        deductions.push('Missing Meta Description');
    } else if (data.description.length < 50 || data.description.length > 160) {
        score -= 5;
        deductions.push('Description length not optimal (50-160 chars)');
    }

    // H1
    if (data.h1.length === 0) {
        score -= 15;
        deductions.push('Missing H1 Tag');
    } else if (data.h1.length > 1) {
        score -= 5;
        deductions.push('Multiple H1 Tags');
    }

    // Images
    const totalImages = data.images.length;
    const missingAlt = data.images.filter(img => !img.alt).length;
    if (totalImages > 0 && missingAlt > 0) {
        const penalty = Math.min(10, Math.ceil((missingAlt / totalImages) * 10));
        score -= penalty;
        deductions.push(`${missingAlt} images missing Alt text`);
    }

    // OG Tags
    if (!data.og.title || !data.og.image) {
        score -= 10;
        deductions.push('Incomplete Open Graph Tags');
    }

    // Word Count (Thin content)
    if (data.wordCount < 300) {
        score -= 10;
        deductions.push('Low word count (<300 words)');
    }

    return {
        score: Math.max(0, score),
        deductions,
    };
}
