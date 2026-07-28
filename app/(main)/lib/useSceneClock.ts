'use client';

import { useEffect, useState } from 'react';

/**
 * Local clock hour as a float (e.g. 14.5 = 2:30pm), refreshed every minute.
 * A `?t=<hour>` query param freezes the clock for visual debugging.
 */
export function useSceneClock(): number {
    const [hour, setHour] = useState(() => currentHour());

    useEffect(() => {
        setHour(currentHour());
        const id = setInterval(() => setHour(currentHour()), 60_000);
        return () => clearInterval(id);
    }, []);

    return hour;
}

export function currentHour(): number {
    if (typeof window !== 'undefined') {
        const override = new URLSearchParams(window.location.search).get('t');
        if (override !== null && override !== '' && !Number.isNaN(Number(override))) {
            return ((Number(override) % 24) + 24) % 24;
        }
    }
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60;
}
