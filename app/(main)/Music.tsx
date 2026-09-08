'use client';

import { useEffect, useState } from 'react';

interface MusicData {
    available: boolean;
    nowPlaying: boolean;
    track: { name: string; artist: string } | null;
    artists: string[];
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

    // Until the feed answers, and whenever it can't, the plain link stands alone.
    if (!data?.available) {
        return (
            <div className="music">
                <p>
                    <a href="https://www.last.fm/user/TomAlmog">music i listen to.</a>
                </p>
            </div>
        );
    }

    return (
        <div className="music">
            {data.track && (
                <p>
                    {data.nowPlaying ? 'currently listening to ' : 'last played '}
                    {data.track.name} by {data.track.artist}
                </p>
            )}
            {data.artists.length > 0 && <p>on repeat this month: {data.artists.join(', ')}</p>}
            <p>
                <a href="https://www.last.fm/user/TomAlmog">more music i listen to.</a>
            </p>
        </div>
    );
}
