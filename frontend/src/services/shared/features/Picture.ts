import Feature from './Feature';

export default interface Picture extends Feature {
    type: 'picture';

    /** picture url */
    url: string;

    text: string;

    /** direction in degrees */
    direction: number;

    /** position of top left corner in format [latitude, longitude] */
    pos: [number, number];

    /** width in px */
    width: number;

    /** height in px */
    height: number;

    /** opacity from 0 to 1 */
    opacity: number;
};
