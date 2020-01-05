import { Marker as LeafletMarker, DivIcon, Popup, tooltip, Tooltip, marker } from 'leaflet';
import { Marker } from '@/services/shared';
import { armaColorToRgba } from '@/utils/color';

export default class MarkerFeature extends LeafletMarker {
    constructor(options: Marker) {
        const style = `
            transform: rotate(${options.direction}deg);
            opacity: ${options.opacity};
        `;

        const [r, g, b, a] = armaColorToRgba(options.color, options);

        const icon = new DivIcon({
            className: 'grad-marker',
            html: `
                <img width="36" height="36" style="${style}" src="/markers/${options.markerType}.png" />
                <span style="color: rgba(${r * 255},${g * 255},${b * 255},${a})">${options.text}</span>
            `,
            iconSize: [36, 36]
        });

        super(options.pos, {
            icon
        });
    }
}
