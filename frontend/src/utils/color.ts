import { Marker } from '@/services/shared';
const markerColors: ArmaMarkerColor[] = require('@/assets/marker-colors.json');
const markers: ArmaMarker[] = require('@/assets/markers.json');

// markerType -> Map<color, url>
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
 * Calculates data url for given marker with fiven color
 * @param marker Marker type (marker id)
 * @param color RGBA Color (all values 0 - 255)
 */
async function calcDataUrl(markerType: string, color: RGBA): Promise<string> {
    const img = await loadImageData(`/markers/${markerType}.png`);

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('Couldn`t get context of canvas.');

    // add image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.remove();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const multiply = (rgba1: RGB, rgb2: RGB): RGB => {
        return rgba1.map((element, index) => Math.floor((element * rgb2[index]) / 255)) as RGB;
    };

    for (let index = 0; index < data.length; index += 4) {
        const subArray = data.slice(index, index + 4);
        const r = subArray[0];
        const g = subArray[1];
        const b = subArray[2];
        const a = subArray[3];
        if (a === 0) continue;

        let newColor = [
            ...multiply(color.slice(0, 3) as [number, number, number], [r, g, b]),
            a
        ];

        data[index + 0] = newColor[0];
        data[index + 1] = newColor[1];
        data[index + 2] = newColor[2];
        data[index + 3] = newColor[3];
    }

    ctx.putImageData(imgData, 0, 0);
    const url = canvas.toDataURL();

    canvas.remove();

    return url;
};

/**
 * Returns rgba (0-1) representation of marker color
 * @param colorId Color id
 * @param markerType Marker type
 */
export function armaColorToRgba(colorId: string, markerType: string): RGBA {
    let color: RGBA = [0, 0, 0, 1];

    if (colorId === 'GRAD_DEFAULT_COLOR') {
        const armaMarker = markers.find(m => m.id === markerType);
        if (armaMarker !== undefined) return armaMarker.defaultColor;
    } else {
        const armaColor = markerColors.find(c => c.id === colorId);
        if (armaColor !== undefined) return armaColor.color;
    }

    return color;
};

export async function getColoredMarkerURL(markerType: string, colorId: string): Promise<string> {
    if (!urlCache.has(markerType)) {
        urlCache.set(markerType, new Map());
    }

    const markerCache = urlCache.get(markerType)!;

    if (!markerCache.has(colorId)) {
        const rgba = armaColorToRgba(colorId, markerType);

        const url = await calcDataUrl(markerType, rgba.map(x => x * 255) as RGBA); // TODO
        markerCache.set(colorId, url);
    }

    return markerCache.get(colorId)!;
};
