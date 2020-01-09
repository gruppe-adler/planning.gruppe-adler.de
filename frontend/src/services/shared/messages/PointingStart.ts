import Message from './Message';

export default interface PointingStartMessage extends Message {
    type: 'pointing_start';

    /** pointing position [latitude, longitude] */
    payload: [number, number];
};
