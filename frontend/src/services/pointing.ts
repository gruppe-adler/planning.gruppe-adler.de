import { WebSocketController } from './websocket';
import { PointingStartMessage, PointingUpdateMessage, PointingStopMessage } from './shared/messages';
import { LatLng } from 'leaflet';

export default class PointingService {
    private controller: WebSocketController;

    constructor(controller: WebSocketController) {
        this.controller = controller;
    }

    public start(pos: LatLng) {
        const msg: PointingStartMessage = {
            type: 'pointing_start',
            payload: [pos.lat, pos.lng]
        };

        this.controller.send(msg);
    }

    public update(pos: LatLng) {
        const msg: PointingUpdateMessage = {
            type: 'pointing_update',
            payload: [pos.lat, pos.lng]
        };

        this.controller.send(msg);
    }

    public stop() {
        const msg: PointingStopMessage = {
            type: 'pointing_stop',
            payload: undefined
        };

        this.controller.send(msg);
    }
}
