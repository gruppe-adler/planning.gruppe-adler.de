import { Marker as LeafletMarker, DivIcon, LeafletMouseEvent } from 'leaflet';
import { Marker } from '@/services/shared';
import { armaColorToRgba, getColoredMarkerURL } from '@/utils/color';
import FeatureInteractionEvent from './FeatureInteractionEvent';

export default class MarkerFeature extends LeafletMarker {
    constructor(options: Marker, interactive: boolean = true) {
        super(options.pos);

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
                <span style="color: rgba(${r},${g},${b},${a})">${options.text}</span>
            `,
            iconSize: [36, 36]
        });

        this.setIcon(icon);
    }
}
