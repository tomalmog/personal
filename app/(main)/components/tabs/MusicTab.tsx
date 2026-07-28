'use client';

import { useEffect, useState } from 'react';
import { Music2 } from 'lucide-react';
import { identity } from '../../lib/content';
import type { LastfmTrack, LastfmArtist, LastfmAlbum } from '../../lib/lastfm';

interface MusicData {
    available: boolean;
    nowPlaying: LastfmTrack | null;
    recent: LastfmTrack[];
    topArtists: LastfmArtist[];
    topAlbums: LastfmAlbum[];
    scrobbles: number;
    fetchedAt: string;
}

type View = 'recent' | 'artists' | 'albums';

function timeAgo(iso: string | null): string {
    if (!iso) return '';
    const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

function Equalizer() {
    return (
        <span className="flex h-3.5 items-end gap-[2px]" aria-label="now playing">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="eq-bar w-[3px] rounded-sm bg-[var(--accent)]"
                    style={{ height: '100%', animationDelay: `${i * 0.18}s` }}
                />
            ))}
        </span>
    );
}

function Art({ src, alt, size = 40 }: { src: string | null; alt: string; size?: number }) {
    if (!src) {
        return (
            <span
                className="flex shrink-0 items-center justify-center rounded bg-[var(--surface-2)] text-[var(--muted)]"
                style={{ width: size, height: size }}
            >
                <Music2 size={size * 0.45} />
            </span>
        );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={size} height={size} className="shrink-0 rounded object-cover" />;
}

export default function MusicTab() {
    const [data, setData] = useState<MusicData | null>(null);
    const [view, setView] = useState<View>('recent');

    useEffect(() => {
        let cancelled = false;
        const load = () =>
            fetch('/api/lastfm')
                .then((r) => r.json())
                .then((d) => {
                    if (!cancelled && d) setData((prev) => (d.available ? d : prev ?? d));
                })
                .catch(() => {
                    if (!cancelled) setData((prev) => prev ?? { available: false } as MusicData);
                });
        load();
        const id = setInterval(() => {
            if (!document.hidden) load();
        }, 30_000);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    if (data === null) {
        return (
            <div>
                <p className="mono-label mb-3">music</p>
                <p className="text-sm text-[var(--muted)]">Tuning in…</p>
            </div>
        );
    }

    if (!data.available) {
        return (
            <div>
                <p className="mono-label mb-3">music</p>
                <p className="max-w-prose text-sm leading-relaxed text-[var(--muted)]">
                    The live feed is offline right now — my whole listening history is at{' '}
                    <a href={identity.lastfmUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                        last.fm/user/{identity.lastfmUser}
                    </a>
                    .
                </p>
            </div>
        );
    }

    const np = data.nowPlaying;
    const lastTrack = data.recent[0];

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="mono-label">music</p>
                    <p className="text-2xl font-semibold tabular-nums text-[var(--ink)]">
                        {data.scrobbles.toLocaleString()}
                        <span className="ml-2 text-sm font-normal text-[var(--muted)]">scrobbles all time</span>
                    </p>
                </div>
                <a
                    href={identity.lastfmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[var(--muted)] hover:text-[var(--accent)]"
                >
                    last.fm/user/{identity.lastfmUser} ↗
                </a>
            </div>

            {np ? (
                <div className="flex items-center gap-3 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3">
                    <Art src={np.image} alt={np.album || np.name} size={44} />
                    <div className="min-w-0 flex-1">
                        <p className="mono-label !text-[var(--accent)]">now playing</p>
                        <p className="truncate font-medium text-[var(--ink)]">{np.name}</p>
                        <p className="truncate text-sm text-[var(--muted)]">{np.artist}</p>
                    </div>
                    <Equalizer />
                </div>
            ) : lastTrack ? (
                <div className="flex items-center gap-3 rounded-lg border border-[var(--hairline)] px-4 py-3">
                    <Art src={lastTrack.image} alt={lastTrack.album || lastTrack.name} size={44} />
                    <div className="min-w-0 flex-1">
                        <p className="mono-label">last played · {timeAgo(lastTrack.playedAt)}</p>
                        <p className="truncate font-medium text-[var(--ink)]">{lastTrack.name}</p>
                        <p className="truncate text-sm text-[var(--muted)]">{lastTrack.artist}</p>
                    </div>
                </div>
            ) : null}

            <div className="flex gap-1.5">
                {(['recent', 'artists', 'albums'] as View[]).map((v) => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                            view === v
                                ? 'bg-[var(--ink)] text-[var(--surface)]'
                                : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'
                        }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {view === 'recent' && (
                <div className="flex flex-col gap-1">
                    {data.recent.slice(0, 10).map((t, i) => (
                        <a
                            key={`${t.url}-${i}`}
                            href={t.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--surface-2)]"
                        >
                            <Art src={t.image} alt={t.album || t.name} size={32} />
                            <span className="min-w-0 truncate text-sm font-medium text-[var(--ink)]">{t.name}</span>
                            <span className="min-w-0 truncate text-sm text-[var(--muted)]">{t.artist}</span>
                            <span className="ml-auto shrink-0 font-mono text-xs text-[var(--muted)]">
                                {timeAgo(t.playedAt)}
                            </span>
                        </a>
                    ))}
                </div>
            )}

            {view === 'artists' && (
                <div className="flex flex-col gap-1">
                    {data.topArtists.map((a, i) => (
                        <a
                            key={a.url}
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--surface-2)]"
                        >
                            <span className="w-6 shrink-0 text-right font-mono text-xs text-[var(--muted)]">{i + 1}</span>
                            <span className="min-w-0 truncate text-sm font-medium text-[var(--ink)]">{a.name}</span>
                            <span className="ml-auto shrink-0 font-mono text-xs text-[var(--muted)]">
                                {a.playcount.toLocaleString()} plays
                            </span>
                        </a>
                    ))}
                    <p className="mt-1 px-2 font-mono text-[10px] text-[var(--muted)]">past 12 months</p>
                </div>
            )}

            {view === 'albums' && (
                <div>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {data.topAlbums.slice(0, 12).map((al) => (
                            <a
                                key={al.url}
                                href={al.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                                title={`${al.name} — ${al.artist}`}
                            >
                                <div className="aspect-square overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--surface-2)]">
                                    {al.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={al.image}
                                            alt={al.name}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center text-[var(--muted)]">
                                            <Music2 size={24} />
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 truncate text-xs font-medium text-[var(--ink)]">{al.name}</p>
                                <p className="truncate text-xs text-[var(--muted)]">{al.artist}</p>
                            </a>
                        ))}
                    </div>
                    <p className="mt-2 font-mono text-[10px] text-[var(--muted)]">past 12 months</p>
                </div>
            )}
        </div>
    );
}
