import { NextResponse } from 'next/server';
import {
    parseRecentTracks,
    parseTopArtists,
    parseTopAlbums,
    parseScrobbleCount,
} from '../../(main)/lib/lastfm';

export const dynamic = 'force-dynamic';

const USER = 'TomAlmog';
const BASE = 'https://ws.audioscrobbler.com/2.0/';

async function lastfm(method: string, params: Record<string, string>, key: string) {
    const qs = new URLSearchParams({
        method,
        user: USER,
        api_key: key,
        format: 'json',
        ...params,
    });
    const res = await fetch(`${BASE}?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Last.fm ${method} failed: ${res.status}`);
    return res.json();
}

export async function GET() {
    const key = process.env.LASTFM_API_KEY;
    if (!key) {
        return NextResponse.json({ available: false });
    }

    try {
        const [recent, artists, albums, info] = await Promise.all([
            lastfm('user.getRecentTracks', { limit: '12' }, key),
            lastfm('user.getTopArtists', { limit: '10', period: '12month' }, key),
            lastfm('user.getTopAlbums', { limit: '12', period: '12month' }, key),
            lastfm('user.getInfo', {}, key),
        ]);

        const { nowPlaying, tracks } = parseRecentTracks(recent);
        return NextResponse.json({
            available: true,
            nowPlaying,
            recent: tracks,
            topArtists: parseTopArtists(artists),
            topAlbums: parseTopAlbums(albums),
            scrobbles: parseScrobbleCount(info),
            fetchedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Last.fm API error:', error);
        return NextResponse.json({ available: false });
    }
}
