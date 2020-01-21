import { Marker as LeafletMarker, DivIcon, LatLng } from 'leaflet';
import { Comment } from '@/services/shared';
import GradFeature from './Feature';

export default class CommentFeature extends GradFeature {
    constructor(options: Comment, interactive: boolean = true) {
        super(options, interactive);

        const icon = new DivIcon({
            className: 'grad-comment',
            html: '<i class="material-icons" style="color: #2F80ED; text-shadow: 0px 0.25rem 0.5rem rgba(0, 0, 0, 0.25); font-size: 36px;">mode_comment</i>',
            iconSize: [36, 36]
        });

        const pos = new LatLng(options.pos[0], options.pos[1]);

        this.addLayer(new LeafletMarker(pos, { icon }));
    }
}
