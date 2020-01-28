import { LeafletMouseEvent } from 'leaflet';
import { Feature } from '@/services/shared';

export default interface FeatureInteractionEvent extends LeafletMouseEvent {
    gradFeature: Feature;
}
