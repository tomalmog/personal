import { describe, it, expect } from 'vitest';
import { paletteAt, themeAt, rgb } from '../app/(main)/lib/palette';

describe('paletteAt', () => {
    it('returns full night palette at 3am', () => {
        const p = paletteAt(3);
        expect(p.starAlpha).toBe(1);
        expect(p.fireflyAlpha).toBe(1);
        expect(p.birdAlpha).toBe(0);
    });

    it('returns full day palette at noon', () => {
        const p = paletteAt(12);
        expect(p.starAlpha).toBe(0);
        expect(p.fireflyAlpha).toBe(0);
        expect(p.birdAlpha).toBe(1);
        expect(p.skyTop).toEqual([64, 138, 214]);
    });

    it('blends between night and dawn around 6am', () => {
        const p = paletteAt(6);
        // 6am sits between the 5:00 night anchor and 6:45 dawn anchor.
        expect(p.starAlpha).toBeLessThan(1);
        expect(p.starAlpha).toBeGreaterThan(0.12);
        expect(p.birdAlpha).toBeGreaterThan(0);
        expect(p.birdAlpha).toBeLessThan(0.4);
    });

    it('blends between dusk and night around 8:30pm', () => {
        const p = paletteAt(20.5);
        expect(p.fireflyAlpha).toBeGreaterThan(0.5);
        expect(p.fireflyAlpha).toBeLessThan(1);
    });

    it('wraps around midnight', () => {
        expect(paletteAt(0)).toEqual(paletteAt(24));
        expect(paletteAt(-1)).toEqual(paletteAt(23));
        expect(paletteAt(25)).toEqual(paletteAt(1));
    });
});

describe('themeAt', () => {
    it('is light during the day and dark at night', () => {
        expect(themeAt(12)).toBe('light');
        expect(themeAt(7)).toBe('light');
        expect(themeAt(19.4)).toBe('light');
        expect(themeAt(19.5)).toBe('dark');
        expect(themeAt(3)).toBe('dark');
        expect(themeAt(6.9)).toBe('dark');
    });
});

describe('rgb', () => {
    it('formats with and without alpha', () => {
        expect(rgb([255, 128.4, 0])).toBe('rgb(255,128,0)');
        expect(rgb([10, 20, 30], 0.5)).toBe('rgba(10,20,30,0.5)');
    });
});
