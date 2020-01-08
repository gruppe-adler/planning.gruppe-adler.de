import { Map as LeafletMap } from 'leaflet';

export default abstract class Tool extends EventTarget {
    protected map: LeafletMap;

    constructor(m: LeafletMap) {
        super();
        this.map = m;

        this.setup();
    }

    protected abstract setup(): void;
    public abstract destroy(): void;
}
