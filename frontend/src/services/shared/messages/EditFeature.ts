import Message from './Message';
import Feature from '../features/Feature';

export default interface EditFeatureMessage extends Message {
    type: 'edit_feature';
    payload: Pick<Feature, 'id'> & Partial<Feature>;
}
