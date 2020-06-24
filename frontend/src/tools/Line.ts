import Tool from './Tool';
import { LatLng, LeafletMouseEvent, GeoJSON } from 'leaflet';
import { LineString } from 'geojson';

export class LineCreateEvent extends Event {
    public coords: LatLng[];

    constructor(coords: LatLng[]) {
        super('create');
        this.coords = coords;
    }
}

export default class LineTool extends Tool {
    private points: LatLng[] = [];
    private lastPoint: LatLng|null = null;
    private previewLayer: GeoJSON|null = null;
    private mouseDownListener?: (ev: LeafletMouseEvent) => void;

    protected setup() {
        this.mouseDownListener = (ev: LeafletMouseEvent) => this.onMouseDown(ev);

        this.map.addEventListener('mousedown', this.mouseDownListener);

        // @ts-ignore
        (this.map._container as HTMLElement).style.cursor = 'crosshair';
    }

    public destroy() {
        this.map.removeEventListener('mousedown', this.mouseDownListener);

        // @ts-ignore
        (this.map._container as HTMLElement).style.cursor = '';
    }

    private onMouseDown(event: LeafletMouseEvent) {
        const mouseMove = (ev: LeafletMouseEvent) => this.onMouseMove(ev);

        // disable map
        this.map.dragging.disable();

        // add first point
        this.onMouseMove(event);

        const mouseUp = (ev: LeafletMouseEvent) => {
            // remove listeners
            this.map.removeEventListener('mousemove', mouseMove);
            this.map.removeEventListener('mouseup', mouseUp);

            // add last point
            this.onMouseMove(ev);

            // enable map
            this.map.dragging.enable();

            this.done();
        };

        // add listeners
        this.map.addEventListener('mousemove', mouseMove);
        this.map.addEventListener('mouseup', mouseUp);
    }

    private onMouseMove(event: LeafletMouseEvent) {
        // TODO: Make distance between points relative to worldSize
        if (this.lastPoint === null || event.latlng.distanceTo(this.lastPoint) > 10000) {
            this.points.push(event.latlng);
            this.lastPoint = event.latlng;
            this.updatePreview();
        }
    }

    private updatePreview() {
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

    private done() {
        if (this.previewGeoJSON.coordinates.length < 2) return;

        this.dispatchEvent(new LineCreateEvent(this.points));
        if (this.previewLayer) this.previewLayer.remove();
        this.points = [];
    }
}
