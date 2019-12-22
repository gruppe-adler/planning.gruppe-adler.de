import Feature from './Feature';

export default interface Marker extends Feature {
    type: 'marker';

    text: string;
    direction: number;
    markerType: string;
    pos: [number, number];
    color: string;
    opacity: number;
};
