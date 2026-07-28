import { NextResponse } from 'next/server';
import { parseGithubEvents } from '../../(main)/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await fetch('https://api.github.com/users/tomalmog/events/public?per_page=30', {
            headers: { Accept: 'application/vnd.github+json' },
            next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error(`GitHub events failed: ${res.status}`);
        const events = await res.json();
        return NextResponse.json({ available: true, items: parseGithubEvents(events) });
    } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json({ available: false, items: [] });
    }
}
