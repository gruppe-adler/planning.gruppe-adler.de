import { Feature, Comment, Line, Marker, Picture } from '@/services/shared';

export const validateFeature = (value: unknown): Feature => {
    if (typeof value !== 'object') throw new Error('Value isn\'t a object');
    if (value === null) throw new Error('Value is null');

    const keys = Object.keys(value);

    if (!keys.includes('type')) throw new Error('Value has no \'type\' field');
    if (!['comment', 'line', 'marker', 'picture'].includes((value as { type: any }).type)) throw new Error('Type field of value is not acceptable.');

    const feature = value as { type: 'comment'|'line'|'marker'|'picture' };

    switch (feature.type) {
    case 'comment':
        return validateComment(feature);
    case 'line':
        return validateLine(feature);
    case 'marker':
        return validateMarker(feature);
    case 'picture':
        return validatePicture(feature);
    }
};

const validateComment = (feature: any): Comment => {
    if (typeof feature.text !== 'string') throw new Error();
    if (typeof feature.author !== 'string') throw new Error();
    if (!isLatLng(feature.pos)) throw new Error();

    return {
        id: 'temp',
        type: 'comment',
        text: feature.text,
        author: feature.author,
        pos: feature.pos
    };
};

const validateMarker = (feature: any): Marker => {
    if (typeof feature.text !== 'string') throw new Error();
    if (typeof feature.direction !== 'number') throw new Error();
    if (typeof feature.markerType !== 'string') throw new Error();
    if (!isLatLng(feature.pos)) throw new Error();
    if (typeof feature.color !== 'string') throw new Error();
    if (typeof feature.opacity !== 'number') throw new Error();

    return {
        id: 'temp',
        type: 'marker',
        text: feature.text,
        direction: feature.direction,
        markerType: feature.markerType,
        pos: feature.pos,
        color: feature.color,
        opacity: feature.opacity
    };
};

const validatePicture = (feature: any): Picture => {
    if (typeof feature.url !== 'string') throw new Error();
    if (typeof feature.text !== 'string') throw new Error();
    if (typeof feature.direction !== 'number') throw new Error();
    if (!isLatLng(feature.pos)) throw new Error();
    if (typeof feature.width !== 'number') throw new Error();
    if (typeof feature.height !== 'number') throw new Error();
    if (typeof feature.opacity !== 'number') throw new Error();

    return {
        id: 'temp',
        type: 'picture',
        url: feature.url,
        text: feature.text,
        direction: feature.direction,
        pos: feature.pos,
        width: feature.width,
        height: feature.height,
        opacity: feature.opacity
    };
};

const validateLine = (feature: any): Line => {
    if (typeof feature.color !== 'string') throw new Error();
    if (!Array.isArray(feature.positions)) throw new Error();

    for (const pos of feature.positions as unknown[]) {
        if (!isLatLng(pos)) throw new Error();
    }

    return {
        id: 'temp',
        type: 'line',
        color: feature.color,
        positions: feature.positions
    };
};

const isLatLng = (val: unknown): boolean => {
    if (!Array.isArray(val)) return false;

    const arr = val as unknown[];
    if (arr.length !== 2) return false;

    return (typeof arr[0] === 'number' && typeof arr[1] === 'number');
};
