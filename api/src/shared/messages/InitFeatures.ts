import Message from './Message';
import Feature from '../features/Feature';

export default interface InitFeaturesMessage extends Message {
    type: 'init_features';
    payload: Feature[];
}
