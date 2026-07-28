'use client';

import { useEffect, useState } from 'react';
import { GitCommit } from 'lucide-react';
import { now } from '../../lib/content';
import type { GithubActivityItem } from '../../lib/github';

function timeAgo(iso: string): string {
    const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

export default function NowTab() {
    const [items, setItems] = useState<GithubActivityItem[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/api/github')
            .then((r) => r.json())
            .then((data) => {
                if (!cancelled) setItems(data?.available ? data.items : []);
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="flex items-baseline justify-between">
                    <p className="mono-label">currently building</p>
                    <span className="font-mono text-xs text-[var(--muted)]">updated {now.updated}</span>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                    {now.items.map((item) => (
                        <div key={item.title} className="rounded-lg border border-[var(--hairline)] px-4 py-3">
                            <span className="font-medium text-[var(--ink)]">{item.title}</span>
                            <p className="mt-0.5 text-sm leading-relaxed text-[var(--muted)]">{item.note}</p>
                        </div>
                    ))}
                </div>
            </div>

            {items === null ? (
                <div>
                    <p className="mono-label mb-3">recent activity</p>
                    <p className="text-sm text-[var(--muted)]">Loading GitHub activity…</p>
                </div>
            ) : items.length > 0 ? (
                <div>
                    <p className="mono-label mb-3">recent activity</p>
                    <div className="flex flex-col gap-1.5">
                        {items.map((item, i) => (
                            <a
                                key={i}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-[var(--surface-2)]"
                            >
                                <GitCommit size={14} className="shrink-0 text-[var(--muted)]" />
                                <span className="shrink-0 font-mono text-xs text-[var(--accent)]">
                                    {item.repo.replace('tomalmog/', '')}
                                </span>
                                <span className="min-w-0 truncate text-sm text-[var(--ink)]">{item.message}</span>
                                <span className="ml-auto shrink-0 font-mono text-xs text-[var(--muted)]">
                                    {timeAgo(item.date)}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
