import WebSocket, { Server, Data, OPEN } from 'ws';
import { Message, CreateFeatureMessage, InitFeaturesMessage } from '../shared/messages';
import { updateFeatures } from '../shared';
import PlanningSessionWorker from './PlanningSessionWorker';

/**
 * Callback for when websocket-server receives message
 * @param wss WebSocket Server
 * @param clientSocket Socket of client who sent message
 * @param data Received data
 */
function handleMessage(sessionId: string, clientSocket: WebSocket, data: Data): void {
    const session = PlanningSessionWorker.getInstance().getSession(sessionId);

    if (!session) return;

    const { wss } = session;

    let message: Message;

    try {
        message = JSON.parse(data.toString());
    } catch (err) {
        console.error(`Received non JSON message from client: "${data.toString()}"`);
        return;
    }

    // generate new id and assign it to newly created feature
    if (message.type === 'create_feature') {
        const generateId = (): string => Math.ceil((Math.random() * 1000000000000000)).toString(16);

        let id = generateId();
        while (session.features.findIndex(f => f.id === id) >= 0) {
            id = generateId();
        }

        (message as CreateFeatureMessage).payload.id = id;
    }

    if (['delete_feature', 'create_feature', 'edit_feature', 'init_features'].includes(message.type)) {
        session.features = updateFeatures(session.features, message);
    }

    // relay to all other clients
    wss.clients.forEach(socket => {
        // if (socket === clientSocket) continue;

        if (socket.readyState === OPEN) {
            socket.send(JSON.stringify(message));
        }
    });
}

export default (sessionId: string): Server => {
    const wss = new Server({
        noServer: true,
        perMessageDeflate: {
            zlibDeflateOptions: {
                // See zlib defaults.
                chunkSize: 1024,
                memLevel: 7,
                level: 3
            },
            zlibInflateOptions: {
                chunkSize: 10 * 1024
            },
            // Other options settable:
            clientNoContextTakeover: true, // Defaults to negotiated value.
            serverNoContextTakeover: true, // Defaults to negotiated value.
            serverMaxWindowBits: 10, // Defaults to negotiated value.
            // Below options specified as default values.
            concurrencyLimit: 10, // Limits zlib concurrency for perf.
            threshold: 1024 // Size (in bytes) below which messages
            // should not be compressed.
        }
    });

    wss.on('connection', (socket: WebSocket) => {
        socket.on('message', (data: Data) => handleMessage(sessionId, socket, data));


        const session = PlanningSessionWorker.getInstance().getSession(sessionId);

        if (!session) return;

        const initFeatures: InitFeaturesMessage = {
            type: 'init_features',
            payload: session.features
        };

        socket.send(JSON.stringify(initFeatures));
    });

    return wss;
};
