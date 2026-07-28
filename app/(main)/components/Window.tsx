'use client';

import { useEffect, useState } from 'react';
import { User, FolderGit2, Briefcase, Hammer, Music, Sparkles, Sun, Moon } from 'lucide-react';
import { identity } from '../lib/content';
import { themeAt } from '../lib/palette';
import { useSceneClock } from '../lib/useSceneClock';
import AboutTab from './tabs/AboutTab';
import ProjectsTab from './tabs/ProjectsTab';
import ExperienceTab from './tabs/ExperienceTab';
import NowTab from './tabs/NowTab';
import MusicTab from './tabs/MusicTab';
import AskTab from './tabs/AskTab';

const TABS = [
    { id: 'about', label: 'about', icon: User, component: AboutTab },
    { id: 'projects', label: 'projects', icon: FolderGit2, component: ProjectsTab },
    { id: 'experience', label: 'experience', icon: Briefcase, component: ExperienceTab },
    { id: 'now', label: 'now', icon: Hammer, component: NowTab },
    { id: 'music', label: 'music', icon: Music, component: MusicTab },
    { id: 'ask', label: 'ask', icon: Sparkles, component: AskTab },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Window() {
    const hour = useSceneClock();
    const [activeTab, setActiveTab] = useState<TabId>('about');
    const [themeOverride, setThemeOverride] = useState<'light' | 'dark' | null>(null);
    const theme = themeOverride ?? themeAt(hour);

    // Deep links: #music opens that tab.
    useEffect(() => {
        const applyHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (TABS.some((t) => t.id === hash)) setActiveTab(hash as TabId);
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, []);

    const selectTab = (id: TabId) => {
        setActiveTab(id);
        history.replaceState(null, '', `#${id}`);
    };

    const ActiveComponent = TABS.find((t) => t.id === activeTab)!.component;

    return (
        <div
            data-theme={theme}
            suppressHydrationWarning
            className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-[var(--surface)] shadow-2xl shadow-black/25"
        >
            {/* Window header */}
            <header className="flex items-center gap-3 border-b border-[var(--hairline)] px-5 py-3.5">
                <span className="relative flex h-2.5 w-2.5" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-[15px] font-semibold leading-tight text-[var(--ink)]">
                        {identity.name}
                    </h1>
                    <p className="truncate text-xs text-[var(--muted)]">{identity.tagline}</p>
                </div>
                <button
                    onClick={() => setThemeOverride(theme === 'light' ? 'dark' : 'light')}
                    aria-label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                    className="rounded-md p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                >
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
            </header>

            {/* Tab content */}
            <main className="window-scroll flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
                <ActiveComponent />
            </main>

            {/* Tab bar */}
            <nav className="flex border-t border-[var(--hairline)] px-2 py-1.5" aria-label="Sections">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = tab.id === activeTab;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => selectTab(tab.id)}
                            aria-current={active ? 'page' : undefined}
                            className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 transition-colors ${
                                active
                                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                                    : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]'
                            }`}
                        >
                            <Icon size={16} />
                            <span className="font-mono text-[10px] tracking-wide">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
