import { Marker } from '@/services/shared';
const markerColors: ArmaMarkerColor[] = require('@/assets/marker-colors.json');
const markers: ArmaMarker[] = require('@/assets/markers.json');

interface ArmaMarker {
    id: string;
    defaultColor: [number, number, number, number];
}

interface ArmaMarkerColor {
    color: [number, number, number, number];
    id: string;
}

interface HSL {
    h: number;
    s: number;
    l: number;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) {
        h = 0;
    } else if (cmax === r) {
        // Red is max
        h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
        // Green is max
        h = (b - r) / delta + 2;
    } else {
        // Blue is max
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

const baseFilter: string = 'brightness(50%) sepia(1)'; // this filter turns white into approx baseRGB
const baseRGB: [number, number, number] = [178, 160, 128];
const baseHSL: HSL = rgbToHsl(...baseRGB);

// Props to that chap: https://stackoverflow.com/a/29958459
export function rgbToCssFilter(r: number, g: number, b: number): string {
    const target = rgbToHsl(r, g, b);

    const h = target.h - baseHSL.h;
    const s = 100 + (target.s - baseHSL.s);
    const l = 100 + (target.l - baseHSL.l);

    return `${baseFilter} hue-rotate(${h}deg) saturate(${s + 100}%) brightness(${l}%)`;
}

export function armaColorToRgba(colorId: string, marker: Marker): [number, number, number, number] {
    let color: [number, number, number, number] = [0, 0, 0, 1];

    if (colorId === 'GRAD_DEFAULT_COLOR') {
        const armaMarker = markers.find(m => m.id === marker.markerType);
        if (armaMarker !== undefined) return armaMarker.defaultColor;
    } else {
        const armaColor = markerColors.find(c => c.id === colorId);
        if (armaColor !== undefined) return armaColor.color;
    }

    return color;
}
