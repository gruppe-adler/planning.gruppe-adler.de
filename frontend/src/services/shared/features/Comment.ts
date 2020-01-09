import Feature from './Feature';

export default interface Comment extends Feature {
    type: 'comment';

    /** text of comment */
    text: string;

    /** author of comment */
    author: string;

    /** position [latitude, longitude] */
    pos: [number, number];
};
