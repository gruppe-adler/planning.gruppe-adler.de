import Message from './Message';
import { User } from '../users';

export default interface UserLeaveMessage extends Message {
    type: 'user_leave';
    payload: User;
}
