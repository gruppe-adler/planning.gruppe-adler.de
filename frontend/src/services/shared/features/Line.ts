import Feature from './Feature';

export default interface Line extends Feature {
    type: 'line';

    color: string;
    positions: Array<[number, number]>;
};
