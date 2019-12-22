import Message from './Message';
import { User } from '../users';

export default interface UserJoinMessage extends Message {
    type: 'user_join';
    payload: User;
};
