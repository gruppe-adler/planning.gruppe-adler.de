import { Marker, DivIcon, LatLng } from 'leaflet';
import { Comment } from '@/services/shared';

export default class CommentFeature extends Marker {
    constructor(options: Comment) {
        const icon = new DivIcon({
            className: 'grad-comment',
            html: '<i class="material-icons" style="color: #2F80ED; text-shadow: 0px 0.25rem 0.5rem rgba(0, 0, 0, 0.25); font-size: 36px;">mode_comment</i>',
            iconSize: [36, 36]
        });

        const pos = new LatLng(options.pos[0], options.pos[1]);

        super(pos, {
            icon
        });
    }
}
