import { Feature } from './features';
import { Message, CreateFeatureMessage, DeleteFeatureMessage, EditFeatureMessage, InitMessage } from './messages';

/**
 * Deletes a feature (IN PLACE), which is defined in given message from given features array
 * @param features Array to delete feature from
 * @param msg Message which requests deletion
 */
const deleteFeature = (features: Feature[], msg: DeleteFeatureMessage): Feature[] => {
    const featureId = msg.payload.id;
    const index = features.findIndex(f => f.id === featureId);
    if (index !== -1) {
        features.splice(index, 1);
    };

    return features;
};

/**
 * Deletes a feature (IN PLACE), which is defined in given message from given features array
 * @param features Array to edit feature
 * @param msg Message which requests edit
 */
const editFeature = (features: Feature[], msg: EditFeatureMessage): Feature[] => {
    const featureId = msg.payload.id;
    const updateOptions = msg.payload;

    const index = features.findIndex(f => f.id === featureId);
    if (index === -1) return features;

    const newFeature = { ...features[index], ...updateOptions };

    features.splice(index, 1, newFeature);

    return features;
};

// eslint-disable-next-line import/prefer-default-export
export const updateFeatures = (features: Feature[], message: Message): Feature[] => {
    let featuresCopy = features;

    switch (message.type) {
    case 'create_feature':
        featuresCopy.push((message as CreateFeatureMessage).payload);
        break;
    case 'edit_feature':
        featuresCopy = editFeature(features, message as EditFeatureMessage);
        break;
    case 'delete_feature':
        featuresCopy = deleteFeature(features, message as DeleteFeatureMessage);
        break;
    case 'init':
        featuresCopy = (message as InitMessage).payload.features;
        break;
    default:
        throw new Error(`Message type ${message.type} is not supported`);
    }

    return featuresCopy;
};
