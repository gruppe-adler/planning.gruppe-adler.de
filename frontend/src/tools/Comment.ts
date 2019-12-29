import Tool from './Tool';
import { LatLng, LeafletMouseEvent, GeoJSON } from 'leaflet';

export default class CommentTool extends Tool {
    public onCreate?: (payload: { pos: [number, number], text: string }) => void;

    private clickListener?: (ev: LeafletMouseEvent) => void;
    private pos: [number, number]|null = null;

    public setup() {
        this.clickListener = (ev: LeafletMouseEvent) => this.onClick(ev);

        this.map.addEventListener('dblclick', this.clickListener);
    }

    public destroy() {
        this.map.removeEventListener('dblclick', this.clickListener);
    }

    private onClick(event: LeafletMouseEvent) {
        if (this.pos !== null) return;
        event.originalEvent.stopPropagation();

        const p = event.latlng;
        this.pos = [p.lat, p.lng];

        window.setTimeout(() => this.commit(), 2000);
    }

    private commit() {
        if (this.pos === null) return;

        if (this.onCreate) {
            this.onCreate({ pos: this.pos, text: 'yo' });
        }

        this.pos = null;
    }
}
