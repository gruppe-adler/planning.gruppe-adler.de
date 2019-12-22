import Feature from './Feature';

export default interface Comment extends Feature {
    type: 'comment';

    text: string;
    pos: [number, number];
};
