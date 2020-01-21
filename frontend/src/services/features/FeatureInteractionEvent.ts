import { LeafletEvent } from 'leaflet';
import { Feature } from '../shared';

export default interface FeatureInteractionEvent extends LeafletEvent {
    gradFeature: Feature;
}
