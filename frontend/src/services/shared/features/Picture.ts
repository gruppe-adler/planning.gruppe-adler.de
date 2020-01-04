import Feature from './Feature';

export default interface Picture extends Feature {
    type: 'picture';

    url: string;
    text: string;
    direction: number;
    pos: [number, number];
    width: number;
    height: number;
    opacity: number;
};
