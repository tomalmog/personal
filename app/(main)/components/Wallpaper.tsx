'use client';

import { useEffect, useRef } from 'react';
import { WallpaperScene } from '../lib/scene';
import { paletteAt, rgb } from '../lib/palette';
import { currentHour } from '../lib/useSceneClock';

const FRAME_MS = 1000 / 30;

export default function Wallpaper() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fallback gradient in case 2D drawing is unavailable; set here rather
        // than in JSX so server and client markup match (time-dependent).
        const p = paletteAt(currentHour());
        canvas.style.background = `linear-gradient(${rgb(p.skyTop)}, ${rgb(p.skyMid)} 55%, ${rgb(p.skyHorizon)})`;

        const scene = new WallpaperScene();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const resize = () => {
            canvas.width = Math.round(window.innerWidth * dpr);
            canvas.height = Math.round(window.innerHeight * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            scene.resize(window.innerWidth, window.innerHeight);
            if (reducedMotion) scene.draw(ctx, 0, currentHour());
        };
        resize();
        window.addEventListener('resize', resize);

        if (reducedMotion) {
            // Single static frame; refresh palette occasionally.
            const id = setInterval(() => scene.draw(ctx, 0, currentHour()), 60_000);
            return () => {
                clearInterval(id);
                window.removeEventListener('resize', resize);
            };
        }

        // Paint immediately so the scene is present even if the tab loads
        // hidden (background tab, prerender) before the loop's first frame.
        scene.draw(ctx, 0, currentHour());

        let raf = 0;
        let last = performance.now();
        let elapsed = 0;
        let acc = 0;
        let hidden = document.hidden;

        const loop = (now: number) => {
            raf = requestAnimationFrame(loop);
            const delta = now - last;
            last = now;
            if (hidden) return;
            acc += delta;
            if (acc < FRAME_MS) return;
            elapsed += Math.min(acc, 200) / 1000;
            acc = 0;
            scene.draw(ctx, elapsed, currentHour());
        };
        raf = requestAnimationFrame(loop);

        const onVisibility = () => {
            hidden = document.hidden;
            last = performance.now();
        };
        document.addEventListener('visibilitychange', onVisibility);

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 h-full w-full" />;
}
