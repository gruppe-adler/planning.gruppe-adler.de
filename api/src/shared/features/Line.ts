import Feature from './Feature';

export default interface Line extends Feature {
    type: 'line';

    /** arma marker color */
    color: string;

    /** Array containing positions in format [latitude, longitude] */
    positions: Array<[number, number]>;
};
