'use client';

import Image from 'next/image';
import { about, identity } from '../../lib/content';

const links = [
    { label: 'GitHub', href: identity.github },
    { label: 'LinkedIn', href: identity.linkedin },
    { label: 'Email', href: `mailto:${identity.email}` },
    { label: 'Resume', href: identity.resume },
];

export default function AboutTab() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Image
                    src="/images/profile.jpeg"
                    alt="Tom Almog"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover border border-[var(--hairline)]"
                />
                <div>
                    <p className="mono-label">about</p>
                    <h2 className="text-lg font-semibold text-[var(--ink)]">Hey, I&apos;m Tom.</h2>
                </div>
            </div>

            <div className="flex flex-col gap-4 max-w-prose">
                {about.paragraphs.map((p, i) => (
                    <p key={i} className="text-[15px] leading-relaxed text-[var(--ink)]">
                        {p}
                    </p>
                ))}
            </div>

            <div>
                <p className="mono-label mb-2">proof</p>
                <div className="flex flex-wrap gap-2">
                    {links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            target={l.href.startsWith('mailto') ? undefined : '_blank'}
                            rel="noopener noreferrer"
                            className="rounded-md border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
