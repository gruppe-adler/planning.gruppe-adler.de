import { Marker as LeafletMarker, DivIcon } from 'leaflet';
import { Marker } from '@/services/shared';
import { armaColorToRgba, getColoredMarkerURL } from '@/utils/color';
import GradFeature from './Feature';

export default class MarkerFeature extends GradFeature {
    constructor(options: Marker, interactive: boolean = true) {
        super(options, interactive);

        this.setup(options);
    }

    private async setup(options: Marker) {
        const [r, g, b, a] = armaColorToRgba(options.color, options.markerType);

        const url = await getColoredMarkerURL(options.markerType, options.color);

        const style = `
            transform: rotate(${options.direction}deg);
            opacity: ${options.opacity};
        `;

        const sizeInPx = options.size * 36;

        const icon = new DivIcon({
            className: 'grad-marker',
            html: `
                <img width="${sizeInPx}" height="${sizeInPx}" style="${style}" src="${url}" />
                <span style="color: rgba(${r},${g},${b},${a})">${options.text}</span>
            `,
            iconSize: [sizeInPx, sizeInPx]
        });

        this.addLayer(new LeafletMarker(options.pos, { icon }));
    }
}
