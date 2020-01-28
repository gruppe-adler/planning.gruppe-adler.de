import { Message } from '@/services/shared';
import { API_DOMAIN, API_SECURE } from '.';

export class WebSocketController {
    private socket: WebSocket;
    private eventHandler: Map<string, Function[]> = new Map<string, Function[]>();
    private id: string;

    constructor(id: string) {
        this.id = id;

        this.socket = this.setupSocket();
    }

    private setupSocket(): WebSocket {
        const socket = new WebSocket(`ws${API_SECURE ? 's' : ''}://${API_DOMAIN}/api/join/${this.id}`);

        socket.onopen = () => this.emit('open');
        socket.onclose = (ev: CloseEvent) => this.onClose(ev);
        socket.onerror = (err) => this.emit('error', err);
        socket.onmessage = (ev: MessageEvent) => this.onMessage(ev);

        return socket;
    }

    private onClose(ev: CloseEvent) {
        // reconnect
        this.emit('close');
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
