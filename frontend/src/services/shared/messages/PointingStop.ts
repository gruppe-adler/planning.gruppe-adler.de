import Message from './Message';

export default interface PointingStopMessage extends Message {
    type: 'pointing_stop';
    payload: undefined;
};
