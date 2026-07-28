import { describe, it, expect } from 'vitest';
import {
    parseRecentTracks,
    parseTopArtists,
    parseTopAlbums,
    parseScrobbleCount,
} from '../app/(main)/lib/lastfm';

const img = (url: string) => [
    { size: 'small', '#text': '' },
    { size: 'extralarge', '#text': url },
];

describe('parseRecentTracks', () => {
    it('separates a now-playing track from history', () => {
        const json = {
            recenttracks: {
                track: [
                    {
                        name: 'Jesus, Etc.',
                        artist: { '#text': 'Wilco' },
                        album: { '#text': 'Yankee Hotel Foxtrot' },
                        image: img('https://img/np.jpg'),
                        url: 'https://last.fm/np',
                        '@attr': { nowplaying: 'true' },
                    },
                    {
                        name: 'Motion Sickness',
                        artist: { '#text': 'Phoebe Bridgers' },
                        album: { '#text': 'Stranger in the Alps' },
                        image: img('https://img/t1.jpg'),
                        url: 'https://last.fm/t1',
                        date: { uts: '1753700000' },
                    },
                ],
            },
        };
        const { nowPlaying, tracks } = parseRecentTracks(json);
        expect(nowPlaying?.name).toBe('Jesus, Etc.');
        expect(nowPlaying?.nowPlaying).toBe(true);
        expect(tracks).toHaveLength(1);
        expect(tracks[0].artist).toBe('Phoebe Bridgers');
        expect(tracks[0].playedAt).toBe(new Date(1753700000 * 1000).toISOString());
    });

    it('handles nothing playing', () => {
        const json = {
            recenttracks: {
                track: [
                    {
                        name: 'Song',
                        artist: { '#text': 'Artist' },
                        album: { '#text': 'Album' },
                        image: img(''),
                        url: 'u',
                        date: { uts: '1753700000' },
                    },
                ],
            },
        };
        const { nowPlaying, tracks } = parseRecentTracks(json);
        expect(nowPlaying).toBeNull();
        expect(tracks).toHaveLength(1);
        expect(tracks[0].image).toBeNull();
    });

    it('handles a single (non-array) track and empty payloads', () => {
        const single = {
            recenttracks: { track: { name: 'Solo', artist: { '#text': 'A' }, url: 'u' } },
        };
        expect(parseRecentTracks(single).tracks).toHaveLength(1);
        expect(parseRecentTracks({}).tracks).toHaveLength(0);
        expect(parseRecentTracks({}).nowPlaying).toBeNull();
    });
});

describe('parseTopArtists', () => {
    it('parses names and playcounts', () => {
        const json = {
            topartists: {
                artist: [
                    { name: 'Radiohead', playcount: '812', url: 'https://last.fm/r' },
                    { name: 'MF DOOM', playcount: '540', url: 'https://last.fm/d' },
                ],
            },
        };
        const artists = parseTopArtists(json);
        expect(artists).toHaveLength(2);
        expect(artists[0]).toEqual({ name: 'Radiohead', playcount: 812, url: 'https://last.fm/r' });
    });
});

describe('parseTopAlbums', () => {
    it('parses album, artist, and art', () => {
        const json = {
            topalbums: {
                album: [
                    {
                        name: 'In Rainbows',
                        artist: { name: 'Radiohead' },
                        playcount: '210',
                        image: img('https://img/a.jpg'),
                        url: 'https://last.fm/a',
                    },
                ],
            },
        };
        const albums = parseTopAlbums(json);
        expect(albums[0].artist).toBe('Radiohead');
        expect(albums[0].image).toBe('https://img/a.jpg');
        expect(albums[0].playcount).toBe(210);
    });
});

describe('parseScrobbleCount', () => {
    it('reads the playcount', () => {
        expect(parseScrobbleCount({ user: { playcount: '184036' } })).toBe(184036);
        expect(parseScrobbleCount({})).toBe(0);
    });
});
