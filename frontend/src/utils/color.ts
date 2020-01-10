import { Marker } from '@/services/shared';
const markerColors: ArmaMarkerColor[] = require('@/assets/marker-colors.json');
const markers: ArmaMarker[] = require('@/assets/markers.json');

// markerType -> Map<color in hex, url>
const urlCache: Map<string, Map<string, string>> = new Map();

interface ArmaMarker {
    id: string;
    defaultColor: [number, number, number, number];
}

interface ArmaMarkerColor {
    color: [number, number, number, number];
    id: string;
}

type RGBA = [number, number, number, number];
type RGB = [number, number, number];

/**
 * Returns rgb representation of given hex color
 * @param hex Color in hex format
 */
export function hexToRgb(hex: string): RGB {
    // check if hex matches shorthand (3 digits/chars after #)
    if (/^#([A-Z]|\d){3}$/i.test(hex)) {
        const r = hex.charAt(1);
        const g = hex.charAt(2);
        const b = hex.charAt(3);

        // transform to 6 digit hex color
        hex = `#${r}${r}${g}${g}${b}${b}`;
    }

    if (!/^#([A-Z]|\d){6}$/i.test(hex)) throw new Error('Given value is not a correct hex color');

    const r = hex.substr(1, 2);
    const g = hex.substr(3, 2);
    const b = hex.substr(5, 2);

    return [
        Number.parseInt(r, 16),
        Number.parseInt(g, 16),
        Number.parseInt(b, 16)
    ];
}

/**
 * Returns hex representation of given rgb color
 * @param rgb Color in rgb format
 */
export function rgbToHex(rgb: RGB): string {
    const hex = (num: number) => {
        const h = Math.round(num).toString(16);

        return `${h.length === 1 ? '0' : ''}${h}`;
    };

    return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}`;
}

/**
 * Creates image tag and resolves once image is loaded
 * @param url Image url
 */
function loadImageData(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
};

/**
 * Calculates data url for given marker with given color
 * @param marker Marker type (marker id)
 * @param color RGB Color (all values 0 - 255)
 */
async function calcDataUrl(markerType: string, color: RGB): Promise<string> {
    const img = await loadImageData(`/markers/${markerType}.png`);

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Couldn`t get context of canvas.');

    // add image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.remove();

    // extract the data
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const multiply = (rgb1: RGB, rgb2: RGB): RGB => {
        return rgb1.map((element, index) => Math.floor((element * rgb2[index]) / 255)) as RGB;
    };

    for (let index = 0; index < data.length; index += 4) {
        // read r, g, b, a values
        const subArray = data.slice(index, index + 4);
        const [r, g, b, a] = subArray;

        // we don't need to change any values if it has no opacity
        if (a === 0) continue;

        let newColor = [
            ...multiply(color, [r, g, b]),
            a
        ];

        data[index + 0] = newColor[0];
        data[index + 1] = newColor[1];
        data[index + 2] = newColor[2];
        data[index + 3] = newColor[3];
    }

    // update canvas and export its content as url
    ctx.putImageData(imgData, 0, 0);
    const url = canvas.toDataURL();

    canvas.remove();

    return url;
};

/**
 * Returns rgba representation of marker color
 * @param colorId Color id
 * @param markerType Marker type
 */
export function armaColorToRgba(colorId: string, markerType: string): RGBA {
    let color: RGBA = [0, 0, 0, 1];

    if (colorId === 'GRAD_DEFAULT_COLOR') {
        const armaMarker = markers.find(m => m.id === markerType);
        if (armaMarker !== undefined) color = armaMarker.defaultColor;
    } else {
        const armaColor = markerColors.find(c => c.id === colorId);
        if (armaColor !== undefined) color = armaColor.color;
    }

    const [r, g, b, a] = color;

    return [r * 255, g * 255, b * 255, a];
};

async function getUrlFromCache(type: string, hex: string): Promise<string> {
    if (!urlCache.has(type)) {
        urlCache.set(type, new Map());
    }
    const markerCache = urlCache.get(type)!;

    if (!markerCache.has(hex)) {
        const url = await calcDataUrl(type, hexToRgb(hex));
        markerCache.set(hex, url);
    }

    return markerCache.get(hex)!;
}

export async function getColoredMarkerURL(markerType: string, colorId: string): Promise<string> {
    const rgba = armaColorToRgba(colorId, markerType);
    const hex = rgbToHex(rgba.slice(0, 3) as RGB);
    return getUrlFromCache(markerType, hex);
};

export async function getHexColoredMarkerURL(markerType: string, hex: string): Promise<string> {
    return getUrlFromCache(markerType, hex);
}
