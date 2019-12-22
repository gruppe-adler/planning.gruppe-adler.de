import { Map } from 'leaflet';

export default abstract class Tool {
    map: Map;
    constructor(m: Map) {
        this.map = m;

        this.setup();
    }

    abstract setup(): void;
    public abstract destroy(): void;

    public abstract onDone?: (payload: any) => void;
}
