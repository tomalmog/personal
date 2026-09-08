'use client';

import { useEffect, useState } from 'react';

interface Entry {
    name: string;
    artist?: string;
    url: string;
}

interface MusicData {
    available: boolean;
    nowPlaying: boolean;
    track: Entry | null;
    tracks: Entry[];
    artists: Entry[];
}

function joinLinks(entries: Entry[]) {
    return entries.map((e, i) => (
        <span key={e.url}>
            {i > 0 && ' \u00b7 '}
            <a href={e.url}>{e.name}</a>
        </span>
    ));
}

export default function Music() {
    const [data, setData] = useState<MusicData | null>(null);

    useEffect(() => {
        let cancelled = false;
        const load = () =>
            fetch('/api/music')
                .then((r) => r.json())
                .then((d) => {
                    if (!cancelled) setData(d);
                })
                .catch(() => {});
        load();
        const id = setInterval(() => {
            if (!document.hidden) load();
        }, 60_000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    // Render nothing until the feed answers, and nothing at all if it can't.
    if (!data?.available) return null;

    return (
        <>
            <h2>music i like</h2>
            <ul>
                {data.track && (
                    <li>
                        {data.nowPlaying ? 'currently playing ' : 'last played '}
                        <a href={data.track.url}>{data.track.name}</a>
                        {data.track.artist && ` by ${data.track.artist}`}
                    </li>
                )}
                {data.tracks.length > 0 && <li>top songs this month: {joinLinks(data.tracks)}</li>}
                {data.artists.length > 0 && <li>top artists this month: {joinLinks(data.artists)}</li>}
            </ul>
        </>
    );
}
