import { GeoJSON, PathOptions, LeafletEvent, FeatureGroup } from 'leaflet';
import { LineString } from 'geojson';
import { Line } from '@/services/shared';

export default class LineFeature extends FeatureGroup {
    private mainFeature: GeoJSON;
    private hoverFeature: GeoJSON;

    constructor(options: Line) {
        super();

        const coordinates = options.positions.map(([lat, lng]) => [lng, lat]);

        this.mainFeature = new GeoJSON(
            {
                type: 'LineString',
                coordinates
            } as LineString,
            {
                style: {
                    color: options.color,
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
                    color: options.color,
                    weight: 7,
                    opacity: 0
                }
            }
        );

        this.on('mouseover', this.onMouseOver.bind(this));
        this.on('mouseout', this.onMouseOut.bind(this));

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
