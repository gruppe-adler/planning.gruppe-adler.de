import Feature from './Feature';

export default interface Comment extends Feature {
    type: 'comment';

    text: string;
    author: string;
    pos: [number, number];
};
