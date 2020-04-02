import { GeoJSON, LeafletEvent } from 'leaflet';
import { LineString } from 'geojson';
import { Line } from '@/services/shared';
import GradFeature from './Feature';
import { armaColorToRgba } from '@/utils/color';

export default class LineFeature extends GradFeature {
    private mainFeature: GeoJSON;
    private hoverFeature: GeoJSON;

    constructor(options: Line, interactive: boolean = true) {
        super(options, interactive);

        const [r, g, b, a] = armaColorToRgba(options.color, '');

        const coordinates = options.positions.map(([lat, lng]) => [lng, lat]);
        const color = `rgba(${r}, ${g}, ${b},${a})`;

        this.mainFeature = new GeoJSON(
            {
                type: 'LineString',
                coordinates
            } as LineString,
            {
                style: {
                    color,
                    weight: 2,
                    opacity: 1
                }
            }
        );

        this.hoverFeature = new GeoJSON(
            {
                type: 'LineString',
                coordinates
            } as LineString,
            {
                style: {
                    color,
                    weight: 7,
                    opacity: 0
                }
            }
        );

        this.addEventListener('mouseover', this.onMouseOver.bind(this));
        this.addEventListener('mouseout', this.onMouseOut.bind(this));

        this.addLayer(this.mainFeature);
        this.addLayer(this.hoverFeature);
    }

    private onMouseOver(ev: LeafletEvent) {
        this.hoverFeature.setStyle({ opacity: 0.2 });
    }

    private onMouseOut(ev: LeafletEvent) {
        this.hoverFeature.setStyle({ opacity: 0 });
    }
}
