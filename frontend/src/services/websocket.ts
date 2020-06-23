import { Message } from '@/services/shared';
import { API_DOMAIN, API_SECURE } from '.';

export class WebSocketControllerMessageEvent extends Event {
    public message: Message;

    constructor(msg: Message) {
        super('message');

        this.message = msg;
    }
}

export class WebSocketController extends EventTarget {
    private socket: WebSocket;
    private id: string;

    constructor(id: string) {
        super();

        this.id = id;

        this.socket = this.setupSocket();
    }

    private setupSocket(): WebSocket {
        const socket = new WebSocket(`ws${API_SECURE ? 's' : ''}://${API_DOMAIN}/api/join/${this.id}`);

        socket.onopen = () => this.dispatchEvent(new Event('open'));
        socket.onclose = (event: CloseEvent) => this.onClose(event);
        socket.onerror = (error) => this.dispatchEvent(new ErrorEvent('error', { error }));
        socket.onmessage = (event: MessageEvent) => this.onMessage(event);

        return socket;
    }

    private onClose(ev: CloseEvent) {
        // reconnect
        this.dispatchEvent(new Event('close'));
        this.socket = this.setupSocket();
    }

    private onMessage(ev: MessageEvent) {
        const data = ev.data;

        let message: Message;
        try {
            message = JSON.parse(data.toString());
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`WebSocket received non JSON message from client: '${data.toString()}'`);
            return;
        }

        this.dispatchEvent(new WebSocketControllerMessageEvent(message));
    }

    public close() {
        this.socket.close();
    }

    public get readyState() {
        return this.socket.readyState;
    }

    public send(msg: Message) {
        // eslint-disable-next-line no-console
        console.log('sending msg', msg);
        this.socket.send(JSON.stringify(msg));
    }
}
