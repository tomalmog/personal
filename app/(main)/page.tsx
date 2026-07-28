'use client';

import { useEffect, useState } from 'react';
import Wallpaper from './components/Wallpaper';
import Window from './components/Window';

function MenuBarClock() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const tick = () =>
            setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
        tick();
        const id = setInterval(tick, 10_000);
        return () => clearInterval(id);
    }, []);
    return <span suppressHydrationWarning>{time}</span>;
}

export default function Home() {
    return (
        <div className="fixed inset-0 overflow-hidden">
            <Wallpaper />

            {/* Faux menu bar */}
            <div
                className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-2 font-mono text-xs text-white/90"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
            >
                <span>
                    tomalmog.com <span className="text-white/55">//</span> online
                </span>
                <MenuBarClock />
            </div>

            {/* The window */}
            <div className="absolute inset-x-2 bottom-2 top-9 flex items-center justify-center sm:inset-x-6 sm:top-12 sm:bottom-6">
                <div className="h-full max-h-[760px] w-full max-w-[1100px] sm:h-[min(100%,760px)] sm:w-[88%]">
                    <Window />
                </div>
            </div>
        </div>
    );
}
