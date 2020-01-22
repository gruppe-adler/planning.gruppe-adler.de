import { Marker as LeafletMarker, DivIcon, Popup, tooltip, Tooltip, marker } from 'leaflet';
import { Pointing } from '@/services/shared';
import { getHexColoredMarkerURL } from '@/utils/color';

export default class PointingFeature extends LeafletMarker {
    constructor(options: Pointing) {
        super(options.pos);

        this.loadIconAsync(options);
    }

    private async loadIconAsync(options: Pointing) {
        const url = await getHexColoredMarkerURL('mil_dot', options.user.color);

        const icon = new DivIcon({
            className: 'grad-pointing',
            html: `
                <img width="36" height="36" src="${url}" />
                <span style="color: ${options.user.color}">${options.user.nick}</span>
            `,
            iconSize: [36, 36]
        });

        this.setIcon(icon);
    }
}
