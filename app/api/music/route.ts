import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const USER = 'TomAlmog';
const BASE = 'https://ws.audioscrobbler.com/2.0/';

interface Entry {
    name: string;
    artist?: string;
    url: string;
}

async function lastfm(method: string, params: Record<string, string>, key: string) {
    const qs = new URLSearchParams({ method, user: USER, api_key: key, format: 'json', ...params });
    const res = await fetch(`${BASE}?${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`${method} failed: ${res.status}`);
    return res.json();
}

export async function GET() {
    const key = process.env.LASTFM_API_KEY;
    if (!key) return NextResponse.json({ available: false });

    try {
        const [recent, topTracks, topArtists] = await Promise.all([
            lastfm('user.getRecentTracks', { limit: '1' }, key),
            lastfm('user.getTopTracks', { limit: '3', period: '1month' }, key),
            lastfm('user.getTopArtists', { limit: '3', period: '1month' }, key),
        ]);

        const raw = recent?.recenttracks?.track;
        const track = Array.isArray(raw) ? raw[0] : raw;

        const tracks: Entry[] = (topTracks?.toptracks?.track ?? [])
            .map((t: any) => ({ name: t?.name, artist: t?.artist?.name ?? '', url: t?.url }))
            .filter((t: Entry) => t.name && t.url);

        const artists: Entry[] = (topArtists?.topartists?.artist ?? [])
            .map((a: any) => ({ name: a?.name, url: a?.url }))
            .filter((a: Entry) => a.name && a.url);

        return NextResponse.json({
            available: true,
            nowPlaying: track?.['@attr']?.nowplaying === 'true',
            track: track
                ? { name: track.name, artist: track.artist?.['#text'] ?? '', url: track.url ?? '' }
                : null,
            tracks,
            artists,
        });
    } catch (error) {
        console.error('Last.fm error:', error);
        return NextResponse.json({ available: false });
    }
}
