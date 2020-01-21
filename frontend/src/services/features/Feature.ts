import { FeatureGroup, LeafletMouseEvent } from 'leaflet';
import FeatureInteractionEvent from './FeatureInteractionEvent';
import { Feature } from '../shared';

export default abstract class GradFeature extends FeatureGroup {
    constructor(feature: Feature, interactive: boolean) {
        super();

        // fire events on map
        if (interactive) {
            this.addEventListener('click', (e: LeafletMouseEvent) => {
                const event: FeatureInteractionEvent = {
                    ...e,
                    gradFeature: feature
                };

                this._map.fireEvent('grad/feature/click', event);
            });
            this.addEventListener('dblclick', (e: LeafletMouseEvent) => {
                const event: FeatureInteractionEvent = {
                    ...e,
                    gradFeature: feature
                };

                this._map.fireEvent('grad/feature/dblclick', event);
            });
        }
    }
}
