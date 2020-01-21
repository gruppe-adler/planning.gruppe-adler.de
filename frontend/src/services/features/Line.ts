import { GeoJSON, LeafletEvent, FeatureGroup, LeafletMouseEvent } from 'leaflet';
import { LineString } from 'geojson';
import { Line } from '@/services/shared';
import FeatureInteractionEvent from './FeatureInteractionEvent';

export default class LineFeature extends FeatureGroup {
    private mainFeature: GeoJSON;
    private hoverFeature: GeoJSON;

    constructor(options: Line, interactive: boolean = true) {
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

        this.addEventListener('mouseover', this.onMouseOver.bind(this));
        this.addEventListener('mouseout', this.onMouseOut.bind(this));

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
