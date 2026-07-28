// Pure parsers for Last.fm API responses. Kept free of fetch/IO for testing.

export interface LastfmTrack {
    name: string;
    artist: string;
    album: string;
    image: string | null;
    url: string;
    nowPlaying: boolean;
    playedAt: string | null; // ISO string
}

export interface LastfmArtist {
    name: string;
    playcount: number;
    url: string;
}

export interface LastfmAlbum {
    name: string;
    artist: string;
    playcount: number;
    image: string | null;
    url: string;
}

type Json = Record<string, any>;

function largestImage(images: Array<Json> | undefined): string | null {
    if (!images || images.length === 0) return null;
    const url = images[images.length - 1]?.['#text'];
    return url && url.length > 0 ? url : null;
}

export function parseRecentTracks(json: Json): { nowPlaying: LastfmTrack | null; tracks: LastfmTrack[] } {
    const raw = json?.recenttracks?.track;
    const list: Json[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const tracks: LastfmTrack[] = list.map((t) => ({
        name: t?.name ?? '',
        artist: t?.artist?.['#text'] ?? t?.artist?.name ?? '',
        album: t?.album?.['#text'] ?? '',
        image: largestImage(t?.image),
        url: t?.url ?? '',
        nowPlaying: t?.['@attr']?.nowplaying === 'true',
        playedAt: t?.date?.uts ? new Date(Number(t.date.uts) * 1000).toISOString() : null,
    }));
    const nowPlaying = tracks.find((t) => t.nowPlaying) ?? null;
    return { nowPlaying, tracks: tracks.filter((t) => !t.nowPlaying) };
}

export function parseTopArtists(json: Json): LastfmArtist[] {
    const raw = json?.topartists?.artist;
    const list: Json[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list.map((a) => ({
        name: a?.name ?? '',
        playcount: Number(a?.playcount ?? 0),
        url: a?.url ?? '',
    }));
}

export function parseTopAlbums(json: Json): LastfmAlbum[] {
    const raw = json?.topalbums?.album;
    const list: Json[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return list.map((a) => ({
        name: a?.name ?? '',
        artist: a?.artist?.name ?? '',
        playcount: Number(a?.playcount ?? 0),
        image: largestImage(a?.image),
        url: a?.url ?? '',
    }));
}

export function parseScrobbleCount(json: Json): number {
    return Number(json?.user?.playcount ?? 0);
}
