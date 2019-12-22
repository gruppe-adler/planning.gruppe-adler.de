import Message from './Message';
import Feature from '../features/Feature';

export default interface CreateFeatureMessage extends Message {
    type: 'create_feature';
    payload: Feature;
}
