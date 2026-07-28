'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { projects, moreProjects, Project } from '../../lib/content';

function ProjectRow({ project }: { project: Project }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-lg border border-[var(--hairline)]">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-2)]"
                aria-expanded={open}
            >
                {open ? (
                    <ChevronDown size={16} className="shrink-0 text-[var(--muted)]" />
                ) : (
                    <ChevronRight size={16} className="shrink-0 text-[var(--muted)]" />
                )}
                <span className="font-medium text-[var(--ink)]">{project.name}</span>
                <span className="hidden truncate text-sm text-[var(--muted)] sm:inline">
                    {project.oneLiner}
                </span>
            </button>
            {open && (
                <div className="border-t border-[var(--hairline)] px-4 py-4">
                    <p className="mb-3 max-w-prose text-[15px] leading-relaxed text-[var(--ink)]">
                        {project.detail}
                    </p>
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {project.tags.map((t) => (
                            <span key={t} className="rounded bg-[var(--surface-2)] px-2 py-0.5 font-mono text-xs text-[var(--muted)]">
                                {t}
                            </span>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.links.map((l) => (
                            <a
                                key={l.label}
                                href={l.url}
                                target={l.url.startsWith('/') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
                            >
                                {l.label}
                                <ExternalLink size={13} />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProjectsTab() {
    const [showMore, setShowMore] = useState(false);
    return (
        <div className="flex flex-col gap-3">
            <p className="mono-label">projects</p>
            {projects.map((p) => (
                <ProjectRow key={p.slug} project={p} />
            ))}
            <button
                onClick={() => setShowMore(!showMore)}
                className="mt-1 self-start text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
                {showMore ? 'Hide older projects' : `Older projects (${moreProjects.length}) →`}
            </button>
            {showMore && moreProjects.map((p) => <ProjectRow key={p.slug} project={p} />)}
        </div>
    );
}
