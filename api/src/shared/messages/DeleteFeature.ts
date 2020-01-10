import Message from './Message';
import { Feature } from '../features';

export default interface DeleteFeatureMessage extends Message {
    type: 'delete_feature';
    payload: Pick<Feature, 'id'>;
}
