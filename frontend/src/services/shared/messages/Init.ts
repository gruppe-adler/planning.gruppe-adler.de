import Message from './Message';
import Feature from '../features/Feature';
import { User } from '../users';

export default interface InitMessage extends Message {
    type: 'init';
    payload: {
        features: Feature[];
        user: User;
    };
}
