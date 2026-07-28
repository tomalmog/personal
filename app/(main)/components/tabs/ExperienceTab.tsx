'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { experience, education, ExperienceEntry } from '../../lib/content';

function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-lg border border-[var(--hairline)]">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
                aria-expanded={open}
            >
                {open ? (
                    <ChevronDown size={16} className="mt-1 shrink-0 text-[var(--muted)]" />
                ) : (
                    <ChevronRight size={16} className="mt-1 shrink-0 text-[var(--muted)]" />
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-medium text-[var(--ink)]">{entry.role}</span>
                        <span className="text-sm text-[var(--muted)]">@ {entry.org}</span>
                    </div>
                    <p className="truncate text-sm text-[var(--muted)]">{entry.oneLiner}</p>
                </div>
                <span className="mt-0.5 shrink-0 font-mono text-xs text-[var(--muted)]">{entry.dates}</span>
            </button>
            {open && (
                <ul className="flex flex-col gap-2 border-t border-[var(--hairline)] px-4 py-4 pl-11">
                    {entry.bullets.map((b, i) => (
                        <li key={i} className="list-disc text-sm leading-relaxed text-[var(--ink)]">
                            {b}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function ExperienceTab() {
    return (
        <div className="flex flex-col gap-3">
            <p className="mono-label">experience</p>
            {experience.map((e) => (
                <ExperienceRow key={`${e.org}-${e.dates}`} entry={e} />
            ))}
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--hairline)] bg-[var(--surface-2)] px-4 py-3">
                <GraduationCap size={18} className="shrink-0 text-[var(--muted)]" />
                <div className="min-w-0 flex-1">
                    <span className="font-medium text-[var(--ink)]">{education.school}</span>
                    <p className="text-sm text-[var(--muted)]">{education.degree}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-[var(--muted)]">{education.dates}</span>
            </div>
        </div>
    );
}
