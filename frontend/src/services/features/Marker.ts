import { Marker as LeafletMarker, DivIcon, Popup, tooltip, Tooltip, marker } from 'leaflet';
import { Marker } from '@/services/shared';
import { armaColorToRgba, getColoredMarkerURL } from '@/utils/color';

export default class MarkerFeature extends LeafletMarker {
    constructor(options: Marker) {
        super(options.pos);

        this.loadIconAsync(options);
    }

    private async loadIconAsync(options: Marker) {
        const [r, g, b, a] = armaColorToRgba(options.color, options.markerType);

        // const url = `/markers/${options.markerType}.png`;
        const url = await getColoredMarkerURL(options.markerType, options.color);

        const style = `
            transform: rotate(${options.direction}deg);
            opacity: ${options.opacity};
        `;

        const icon = new DivIcon({
            className: 'grad-marker',
            html: `
                <img width="36" height="36" style="${style}" src="${url}" />
                <span style="color: rgba(${r * 255},${g * 255},${b * 255},${a})">${options.text}</span>
            `,
            iconSize: [36, 36]
        });

        this.setIcon(icon);
    }
}
