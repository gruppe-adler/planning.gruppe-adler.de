import Tool from './Tool';
import { LatLng, LeafletMouseEvent, GeoJSON } from 'leaflet';
import { LineString } from 'geojson';

export default class LineTool extends Tool {
    public onCreate?: (payload: Array<[number, number]>) => void;

    private points: LatLng[] = [];
    private lastPoint: LatLng|null = null;
    private previewLayer: GeoJSON|null = null;
    private mouseDownListener?: (ev: LeafletMouseEvent) => void;

    setup() {
        this.mouseDownListener = (ev: LeafletMouseEvent) => this.onMouseDown(ev);

        this.map.addEventListener('mousedown', this.mouseDownListener);
    }

    public destroy() {
        this.map.removeEventListener('mousedown', this.mouseDownListener);
    }

    private onMouseDown(event: LeafletMouseEvent) {
        const mouseMove = (ev: LeafletMouseEvent) => this.onMouseMove(ev);

        this.map.addEventListener('mousemove', mouseMove);
        this.map.dragging.disable();

        // add first point
        this.onMouseMove(event);

        const mouseUp = (ev: LeafletMouseEvent) => {
            this.map.removeEventListener('mousemove', mouseMove);
            this.map.removeEventListener('mouseup', mouseUp);

            // add last point
            this.onMouseMove(ev);
            this.map.dragging.enable();

            this.commit();
        };

        this.map.addEventListener('mouseup', mouseUp);
    }

    private onMouseMove(event: LeafletMouseEvent) {
        // TODO: Make distance between points relative to worldSize
        if (this.lastPoint === null || event.latlng.distanceTo(this.lastPoint) > 10000) {
            this.points.push(event.latlng);
            this.lastPoint = event.latlng;
            this.updateShape();
        }
    }

    private updateShape() {
        if (this.previewLayer) this.previewLayer.remove();

        this.previewLayer = new GeoJSON(this.previewGeoJSON, {
            style: {
                color: 'black', // TODO: color
                weight: 2,
                opacity: 0.5
            }
        }).addTo(this.map);
    }

    private get previewGeoJSON(): LineString {
        return {
            type: 'LineString',
            coordinates: this.points.map(p => [p.lng, p.lat])
        };
    }

    private commit() {
        if (this.onCreate) {
            this.onCreate(this.previewGeoJSON.coordinates as Array<[number, number]>);
        }
        if (this.previewLayer) this.previewLayer.remove();
        this.points = [];
    }
}
