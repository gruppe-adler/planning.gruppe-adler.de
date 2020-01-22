import { LeafletEvent } from 'leaflet';
import { Feature } from '@/services/shared';

export default interface FeatureInteractionEvent extends LeafletEvent {
    gradFeature: Feature;
}
