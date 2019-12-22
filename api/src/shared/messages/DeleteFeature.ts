import Message from './Message';

export default interface DeleteFeatureMessage extends Message {
    type: 'delete_feature';
    payload: {
        id: string;
    };
}
