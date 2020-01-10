import Tool from './Tool';
import { LatLng, LeafletMouseEvent } from 'leaflet';

class PointingStartEvent extends Event {
    public pos: LatLng;

    constructor(pos: LatLng) {
        super('start');
        this.pos = pos;
    }
}

class PointingUpdateEvent extends Event {
    public pos: LatLng;

    constructor(pos: LatLng) {
        super('update');
        this.pos = pos;
    }
}

class PointingStopEvent extends Event {
    constructor() {
        super('stop');
    }
}

interface PointingTool {
    addEventListener(type: 'start', listener: (event: PointingStartEvent) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: 'update', listener: (event: PointingUpdateEvent) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: 'stop', listener: (event: PointingStopEvent) => any, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: 'start', callback: (event: PointingStartEvent) => any, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: 'update', callback: (event: PointingUpdateEvent) => any, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: 'stop', callback: (event: PointingStopEvent) => any, options?: EventListenerOptions | boolean): void;
}

class PointingTool extends Tool {
    private mouseDownListener?: (ev: LeafletMouseEvent) => void;
    private lastPoint: [number, number]|null = null;

    protected setup() {
        this.mouseDownListener = (ev: LeafletMouseEvent) => this.onMouseDown(ev);

        this.map.addEventListener('mousedown', this.mouseDownListener);
    }

    public destroy() {
        this.map.removeEventListener('mousedown', this.mouseDownListener);
    }

    private onMouseDown(event: LeafletMouseEvent) {
        const onMouseMove = (ev: LeafletMouseEvent) => this.onMouseMove(ev);

        // disable map
        this.map.dragging.disable();

        // start pointing
        this.dispatchEvent(new PointingStartEvent(event.latlng));

        const onMouseUp = () => {
            // remove listeners
            this.map.removeEventListener('mousemove', onMouseMove);
            this.map.removeEventListener('mouseup', onMouseUp);

            // enable map dragging
            this.map.dragging.enable();

            // let all listeners know that user stopped pointing
            this.dispatchEvent(new PointingStopEvent());
        };

        this.map.addEventListener('mousemove', onMouseMove);
        this.map.addEventListener('mouseup', onMouseUp);
    }

    private onMouseMove(ev: LeafletMouseEvent) {
        const distance = ([x1, y1]: [number, number], [x2, y2]: [number, number]) => {
            const a = Math.abs(x1 - x2);
            const b = Math.abs(y1 - y2);

            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        };

        const pos: [number, number] = [ev.originalEvent.x, ev.originalEvent.y];

        if (this.lastPoint === null || distance(pos, this.lastPoint) > 20) {
            this.lastPoint = pos;
            this.dispatchEvent(new PointingUpdateEvent(ev.latlng));
        }
    }
}

export default PointingTool;
