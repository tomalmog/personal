// Canvas renderer for the desktop wallpaper: an anime-countryside scene with
// parallax clouds and hills, swaying meadow grass, birds by day, stars and
// fireflies by night. All colors come from palette.ts.

import { ScenePalette, paletteAt, rgb } from './palette';

// Deterministic PRNG so the scene composition is stable across reloads.
function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface Star {
    x: number; // 0..1 of width
    y: number; // 0..1 of sky height
    size: number;
    phase: number;
    speed: number;
}

interface CloudPuff {
    dx: number;
    dy: number;
    r: number;
}

interface Cloud {
    x: number; // px, wraps
    y: number; // 0..1 of sky height
    scale: number;
    speed: number; // px/s
    puffs: CloudPuff[];
}

interface GrassBlade {
    x: number; // 0..1 of width
    height: number;
    lean: number;
    phase: number;
    shade: number; // -1..1 lighten/darken
}

interface Firefly {
    x: number; // 0..1
    y: number; // 0..1 within meadow band
    phase: number;
    speed: number;
    drift: number;
}

interface Bird {
    x: number;
    y: number;
    vx: number;
    flapPhase: number;
    size: number;
}

const HILL_FAR_BASE = 0.58; // fraction of height where far hills sit
const HILL_NEAR_BASE = 0.7;
const MEADOW_BASE = 0.82;

export class WallpaperScene {
    private stars: Star[] = [];
    private clouds: Cloud[] = [];
    private blades: GrassBlade[] = [];
    private fireflies: Firefly[] = [];
    private birds: Bird[] = [];
    private nextFlockAt: number;
    private w = 0;
    private h = 0;

    constructor(private seed = 20260728) {
        const rand = mulberry32(seed);
        for (let i = 0; i < 90; i++) {
            this.stars.push({
                x: rand(),
                y: rand() * 0.85,
                size: 0.6 + rand() * 1.3,
                phase: rand() * Math.PI * 2,
                speed: 0.4 + rand() * 1.2,
            });
        }
        for (let depth = 0; depth < 3; depth++) {
            const count = depth === 0 ? 3 : depth === 1 ? 3 : 2;
            for (let i = 0; i < count; i++) {
                const puffs: CloudPuff[] = [];
                const puffCount = 4 + Math.floor(rand() * 3);
                for (let p = 0; p < puffCount; p++) {
                    puffs.push({
                        dx: (p - puffCount / 2) * (26 + rand() * 14),
                        dy: -rand() * 16,
                        r: 20 + rand() * 22,
                    });
                }
                this.clouds.push({
                    x: rand() * 2000,
                    y: 0.08 + depth * 0.12 + rand() * 0.08,
                    scale: 0.5 + depth * 0.35 + rand() * 0.25,
                    speed: 2.5 + depth * 2.5 + rand() * 2,
                    puffs,
                });
            }
        }
        for (let i = 0; i < 150; i++) {
            this.blades.push({
                x: rand(),
                height: 14 + rand() * 22,
                lean: (rand() - 0.5) * 8,
                phase: rand() * Math.PI * 2,
                shade: rand() * 2 - 1,
            });
        }
        for (let i = 0; i < 18; i++) {
            this.fireflies.push({
                x: rand(),
                y: rand(),
                phase: rand() * Math.PI * 2,
                speed: 0.15 + rand() * 0.35,
                drift: rand() * Math.PI * 2,
            });
        }
        this.nextFlockAt = 20 + rand() * 60;
    }

    resize(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    /** Draw one frame. `t` is elapsed seconds, `hour` is local clock hour. */
    draw(ctx: CanvasRenderingContext2D, t: number, hour: number) {
        const { w, h } = this;
        if (w === 0 || h === 0) return;
        const p = paletteAt(hour);

        this.drawSky(ctx, p);
        this.drawStars(ctx, p, t);
        this.drawCelestial(ctx, p, hour);
        this.drawClouds(ctx, p, t);
        this.drawHills(ctx, p, t);
        this.drawMeadow(ctx, p, t);
        this.updateAndDrawBirds(ctx, p, t);
        this.drawFireflies(ctx, p, t);
    }

    private drawSky(ctx: CanvasRenderingContext2D, p: ScenePalette) {
        const { w, h } = this;
        const grad = ctx.createLinearGradient(0, 0, 0, h * HILL_NEAR_BASE);
        grad.addColorStop(0, rgb(p.skyTop));
        grad.addColorStop(0.55, rgb(p.skyMid));
        grad.addColorStop(1, rgb(p.skyHorizon));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    private drawStars(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        if (p.starAlpha <= 0.01) return;
        const { w, h } = this;
        ctx.save();
        for (const s of this.stars) {
            const twinkle = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
            ctx.globalAlpha = p.starAlpha * twinkle;
            ctx.fillStyle = '#EAF0FA';
            ctx.beginPath();
            ctx.arc(s.x * w, s.y * h * HILL_FAR_BASE, s.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    private drawCelestial(ctx: CanvasRenderingContext2D, p: ScenePalette, hour: number) {
        const { w, h } = this;
        // Sun crosses 6..20, moon crosses 19..7 (wrapping).
        const sunProgress = (hour - 6) / 14;
        const moonHour = hour >= 19 ? hour - 19 : hour + 5; // 0 at 19:00
        const moonProgress = moonHour / 12;

        const drawDisc = (progress: number, radius: number, isMoon: boolean) => {
            if (progress < 0 || progress > 1) return;
            const x = w * (0.08 + progress * 0.84);
            const arc = Math.sin(progress * Math.PI);
            const y = h * (0.52 - arc * 0.38);
            const glow = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 5);
            glow.addColorStop(0, rgb(p.celestial, 0.5));
            glow.addColorStop(1, rgb(p.celestial, 0));
            ctx.fillStyle = glow;
            ctx.fillRect(x - radius * 5, y - radius * 5, radius * 10, radius * 10);
            ctx.fillStyle = rgb(p.celestial);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            if (isMoon) {
                // Bite a crescent out with the sky color.
                ctx.fillStyle = rgb(p.skyTop);
                ctx.beginPath();
                ctx.arc(x - radius * 0.42, y - radius * 0.18, radius * 0.92, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        if (hour >= 6 && hour <= 20) drawDisc(sunProgress, Math.min(w, this.h) * 0.045, false);
        if (hour >= 19 || hour <= 7) drawDisc(moonProgress, Math.min(w, this.h) * 0.038, true);
    }

    private drawClouds(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        const { w, h } = this;
        ctx.save();
        for (const c of this.clouds) {
            const span = w + 320 * c.scale;
            const x = ((c.x + t * c.speed) % span) - 160 * c.scale;
            const y = c.y * h;
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = rgb(p.cloud);
            ctx.beginPath();
            for (const puff of c.puffs) {
                ctx.moveTo(x + puff.dx * c.scale + puff.r * c.scale, y + puff.dy * c.scale);
                ctx.arc(x + puff.dx * c.scale, y + puff.dy * c.scale, puff.r * c.scale, 0, Math.PI * 2);
            }
            ctx.fill();
            // Flat-ish underside for the anime look, spanning only the puffs.
            const minX = Math.min(...c.puffs.map((p2) => p2.dx - p2.r * 0.7));
            const maxX = Math.max(...c.puffs.map((p2) => p2.dx + p2.r * 0.7));
            ctx.fillRect(x + minX * c.scale, y - 2, (maxX - minX) * c.scale, 8 * c.scale);
        }
        ctx.restore();
    }

    private hillY(base: number, amp1: number, amp2: number, f1: number, f2: number, x: number, shift: number) {
        return (
            this.h * base +
            Math.sin(x * f1 + shift) * amp1 +
            Math.sin(x * f2 + shift * 2.7) * amp2
        );
    }

    private drawHills(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        const { w, h } = this;
        // Far hills: soft, hazy.
        ctx.fillStyle = rgb(p.hillFar);
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
            ctx.lineTo(x, this.hillY(HILL_FAR_BASE, h * 0.045, h * 0.02, 0.0038, 0.011, x, 1.3));
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Near hills: deeper green, bigger rolls.
        ctx.fillStyle = rgb(p.hillNear);
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
            ctx.lineTo(x, this.hillY(HILL_NEAR_BASE, h * 0.06, h * 0.022, 0.0028, 0.009, x, 4.1));
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
    }

    private drawMeadow(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        const { w, h } = this;
        ctx.fillStyle = rgb(p.meadow);
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 8) {
            ctx.lineTo(x, this.hillY(MEADOW_BASE, h * 0.02, h * 0.01, 0.004, 0.013, x, 8.9));
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Swaying grass along the bottom band.
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        for (const b of this.blades) {
            const bx = b.x * w;
            const baseY = h - 2;
            const sway = Math.sin(t * 1.1 + b.phase + bx * 0.01) * 3.5;
            const [gr, gg, gb] = p.grass;
            const shade = b.shade * 18;
            ctx.strokeStyle = `rgb(${Math.round(gr + shade)},${Math.round(gg + shade)},${Math.round(gb + shade)})`;
            ctx.beginPath();
            ctx.moveTo(bx, baseY);
            ctx.quadraticCurveTo(
                bx + b.lean * 0.4,
                baseY - b.height * 0.6,
                bx + b.lean + sway,
                baseY - b.height,
            );
            ctx.stroke();
        }
    }

    private updateAndDrawBirds(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        const { w, h } = this;
        if (p.birdAlpha > 0.25 && t > this.nextFlockAt) {
            const rand = mulberry32(Math.floor(t * 1000) ^ this.seed);
            const count = 3 + Math.floor(rand() * 3);
            const fromLeft = rand() > 0.5;
            const baseY = h * (0.12 + rand() * 0.2);
            for (let i = 0; i < count; i++) {
                this.birds.push({
                    x: fromLeft ? -40 - i * 26 : w + 40 + i * 26,
                    y: baseY + (rand() - 0.5) * 40,
                    vx: (fromLeft ? 1 : -1) * (28 + rand() * 10),
                    flapPhase: rand() * Math.PI * 2,
                    size: 5 + rand() * 3,
                });
            }
            this.nextFlockAt = t + 60 + rand() * 60;
        }

        ctx.save();
        ctx.strokeStyle = 'rgba(30,38,48,0.75)';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.min(1, p.birdAlpha + 0.15);
        for (const bird of this.birds) {
            bird.x += bird.vx / 30; // called at ~30fps
            const flap = Math.sin(t * 7 + bird.flapPhase) * bird.size * 0.7;
            ctx.beginPath();
            ctx.moveTo(bird.x - bird.size, bird.y - flap);
            ctx.quadraticCurveTo(bird.x, bird.y + bird.size * 0.3, bird.x, bird.y);
            ctx.quadraticCurveTo(bird.x, bird.y + bird.size * 0.3, bird.x + bird.size, bird.y - flap);
            ctx.stroke();
        }
        ctx.restore();
        this.birds = this.birds.filter((b) => b.x > -80 && b.x < w + 80);
    }

    private drawFireflies(ctx: CanvasRenderingContext2D, p: ScenePalette, t: number) {
        if (p.fireflyAlpha <= 0.01) return;
        const { w, h } = this;
        ctx.save();
        for (const f of this.fireflies) {
            const fx = (f.x + Math.sin(t * f.speed + f.drift) * 0.02) * w;
            const fy = h * (MEADOW_BASE - 0.06) + f.y * h * (1 - MEADOW_BASE + 0.03) + Math.sin(t * f.speed * 1.6 + f.phase) * 8;
            const pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.8 + f.phase));
            const alpha = p.fireflyAlpha * pulse;
            const glow = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, 7);
            glow.addColorStop(0, `rgba(240,214,120,${alpha})`);
            glow.addColorStop(1, 'rgba(240,214,120,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(fx - 7, fy - 7, 14, 14);
        }
        ctx.restore();
    }
}
