import { Marker, DivIcon, LatLng, LeafletMouseEvent } from 'leaflet';
import { Comment } from '@/services/shared';
import FeatureInteractionEvent from './FeatureInteractionEvent';

export default class CommentFeature extends Marker {
    constructor(options: Comment, interactive: boolean = true) {
        const icon = new DivIcon({
            className: 'grad-comment',
            html: '<i class="material-icons" style="color: #2F80ED; text-shadow: 0px 0.25rem 0.5rem rgba(0, 0, 0, 0.25); font-size: 36px;">mode_comment</i>',
            iconSize: [36, 36]
        });

        const pos = new LatLng(options.pos[0], options.pos[1]);

        super(pos, {
            icon
        });

        // fire events on map
        if (interactive) {
            this.addEventListener('click', (e: LeafletMouseEvent) => {
                const event: FeatureInteractionEvent = {
                    ...e,
                    gradFeature: options
                };

                this._map.fireEvent('grad/feature/click', event);
            });
            this.addEventListener('dblclick', (e: LeafletMouseEvent) => {
                const event: FeatureInteractionEvent = {
                    ...e,
                    gradFeature: options
                };

                this._map.fireEvent('grad/feature/dblclick', event);
            });
        }
    }
}
