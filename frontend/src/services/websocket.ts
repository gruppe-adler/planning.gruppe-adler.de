import { Message } from '@/services/shared';
import { API_DOMAIN } from '.';

export class WebSocketController {
    private socket: WebSocket;
    private eventHandler: Map<string, Function[]> = new Map<string, Function[]>();

    constructor(id: string) {
        this.socket = new WebSocket(`wss://${API_DOMAIN}/api/join/${id}`);

        this.socket.onopen = () => this.emit('open');
        this.socket.onclose = () => this.emit('close');
        this.socket.onerror = (err) => this.emit('error', err);
        this.socket.onmessage = (ev: MessageEvent) => this.onMessage(ev);
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

        this.emit('message', message);
    }

    private emit(type: string, ...args: any) {
        if (!this.eventHandler.has(type)) return;

        this.eventHandler.get(type)!.forEach(handler => {
            handler(...args);
        });
    }

    public on(type: 'message', handler: (msg: Message) => any): void;
    public on(type: 'open', handler: () => any): void;
    public on(type: 'close', handler: () => any): void;
    public on(type: 'error', handler: (err: Error) => any): void;
    public on(type: string, handler: Function) {
        if (!this.eventHandler.has(type)) this.eventHandler.set(type, []);

        this.eventHandler.get(type)!.push(handler);
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
