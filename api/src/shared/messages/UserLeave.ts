import Message from './Message';

export default interface UserLeaveMessage extends Message {
    type: 'user_leave';
    payload: {
        uid: string;
    };
}
