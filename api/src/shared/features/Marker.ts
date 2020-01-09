import Feature from './Feature';

export default interface Marker extends Feature {
    type: 'marker';

    /** text next to marker */
    text: string;

    /** marker direction in degrees */
    direction: number;

    /** arma marker type */
    markerType: string;

    /** position [latitude, longitude] */
    pos: [number, number];

    /** arma marker color */
    color: string;

    /** opacity from 0 to 1 */
    opacity: number;
};
