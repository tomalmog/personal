// Time-of-day palettes for the wallpaper scene. All scene colors live here so
// the composition can be tuned in one place.

export type RGB = [number, number, number];

export interface ScenePalette {
    skyTop: RGB;
    skyMid: RGB;
    skyHorizon: RGB;
    cloud: RGB;
    hillFar: RGB;
    hillNear: RGB;
    meadow: RGB;
    grass: RGB;
    celestial: RGB; // sun or moon disc
    starAlpha: number;
    fireflyAlpha: number;
    birdAlpha: number;
}

// Anchor palettes. Hours are local time; anchors wrap around midnight.
// Values are hand-tuned toward an FMAB/Ghibli countryside: saturated blue
// skies, rolling green hills, warm golden dawns and dusks, deep blue nights.
const NIGHT: ScenePalette = {
    skyTop: [8, 15, 38],
    skyMid: [18, 30, 62],
    skyHorizon: [36, 56, 92],
    cloud: [52, 66, 96],
    hillFar: [24, 38, 54],
    hillNear: [17, 31, 40],
    meadow: [13, 30, 24],
    grass: [19, 41, 31],
    celestial: [235, 240, 246],
    starAlpha: 1,
    fireflyAlpha: 1,
    birdAlpha: 0,
};

const DAWN: ScenePalette = {
    skyTop: [96, 126, 180],
    skyMid: [212, 160, 158],
    skyHorizon: [250, 198, 128],
    cloud: [246, 219, 190],
    hillFar: [88, 110, 134],
    hillNear: [68, 105, 82],
    meadow: [80, 122, 70],
    grass: [90, 133, 78],
    celestial: [255, 216, 160],
    starAlpha: 0.12,
    fireflyAlpha: 0,
    birdAlpha: 0.4,
};

const DAY: ScenePalette = {
    skyTop: [64, 138, 214],
    skyMid: [126, 178, 229],
    skyHorizon: [201, 228, 245],
    cloud: [255, 255, 255],
    hillFar: [118, 165, 106],
    hillNear: [92, 145, 80],
    meadow: [111, 168, 85],
    grass: [123, 179, 94],
    celestial: [255, 243, 196],
    starAlpha: 0,
    fireflyAlpha: 0,
    birdAlpha: 1,
};

const DUSK: ScenePalette = {
    skyTop: [58, 70, 120],
    skyMid: [172, 106, 138],
    skyHorizon: [240, 154, 90],
    cloud: [232, 180, 140],
    hillFar: [58, 74, 102],
    hillNear: [46, 74, 60],
    meadow: [53, 84, 58],
    grass: [60, 92, 64],
    celestial: [255, 179, 107],
    starAlpha: 0.3,
    fireflyAlpha: 0.5,
    birdAlpha: 0.2,
};

// (hour, palette) anchors in ascending order covering a full day.
const ANCHORS: Array<[number, ScenePalette]> = [
    [0, NIGHT],
    [5, NIGHT],
    [6.75, DAWN],
    [9.5, DAY],
    [16.5, DAY],
    [19.5, DUSK],
    [21.5, NIGHT],
    [24, NIGHT],
];

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Interpolated scene palette for a local hour in [0, 24). */
export function paletteAt(hour: number): ScenePalette {
    const h = ((hour % 24) + 24) % 24;
    let i = 0;
    while (i < ANCHORS.length - 1 && ANCHORS[i + 1][0] < h) i++;
    const [h0, p0] = ANCHORS[i];
    const [h1, p1] = ANCHORS[i + 1];
    const t = h1 === h0 ? 0 : (h - h0) / (h1 - h0);
    return {
        skyTop: lerpRGB(p0.skyTop, p1.skyTop, t),
        skyMid: lerpRGB(p0.skyMid, p1.skyMid, t),
        skyHorizon: lerpRGB(p0.skyHorizon, p1.skyHorizon, t),
        cloud: lerpRGB(p0.cloud, p1.cloud, t),
        hillFar: lerpRGB(p0.hillFar, p1.hillFar, t),
        hillNear: lerpRGB(p0.hillNear, p1.hillNear, t),
        meadow: lerpRGB(p0.meadow, p1.meadow, t),
        grass: lerpRGB(p0.grass, p1.grass, t),
        celestial: lerpRGB(p0.celestial, p1.celestial, t),
        starAlpha: lerp(p0.starAlpha, p1.starAlpha, t),
        fireflyAlpha: lerp(p0.fireflyAlpha, p1.fireflyAlpha, t),
        birdAlpha: lerp(p0.birdAlpha, p1.birdAlpha, t),
    };
}

/** Window theme that matches the scene at a given hour. */
export function themeAt(hour: number): 'light' | 'dark' {
    const h = ((hour % 24) + 24) % 24;
    return h >= 7 && h < 19.5 ? 'light' : 'dark';
}

export function rgb(c: RGB, alpha = 1): string {
    const [r, g, b] = c.map(Math.round);
    return alpha >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${alpha})`;
}
