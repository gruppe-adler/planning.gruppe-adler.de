import Message from './Message';

export default interface PointingUpdateMessage extends Message {
    type: 'pointing_update';

    /** pointing position [latitude, longitude] */
    payload: [number, number];
};
