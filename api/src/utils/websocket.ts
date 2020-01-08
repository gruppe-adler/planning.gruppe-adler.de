import WebSocket, { Server, Data, OPEN } from 'ws';
import { Message, CreateFeatureMessage, InitMessage, UserJoinMessage, UserLeaveMessage } from '../shared/messages';
import { updateFeatures } from '../shared';
import PlanningSessionWorker from './PlanningSessionWorker';

const generateId = (): string => Math.ceil((Math.random() * 1000000000000000)).toString(16);
const userIds: string[] = [];

/**
 * Callback for when websocket-server receives message
 * @param wss WebSocket Server
 * @param clientSocket Socket of client who sent message
 * @param data Received data
 */
function handleMessage(
    sessionId: string,
    userId: string,
    clientSocket: WebSocket,
    data: Data
): void {
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
    // new user joined
    if (message.type === 'user_join') {
        // update userId
        (message as UserJoinMessage).payload.uid = userId;

        // add user to session
        session.users.set(userId, (message as UserJoinMessage).payload);

        // send init message
        const initMsg: InitMessage = {
            type: 'init',
            payload: {
                features: session.features,
                user: (message as UserJoinMessage).payload
            }
        };
        clientSocket.send(JSON.stringify(initMsg));
    }

    // generate new id and assign it to newly created feature
    if (message.type === 'create_feature') {
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
        if (socket.readyState === OPEN) {
            socket.send(JSON.stringify(message));
        }
    });
}

function handleClose(sessionId: string, userId: string): void {
    const session = PlanningSessionWorker.getInstance().getSession(sessionId);
    if (!session) return;

    if (!session.users.has(userId)) return;
    const user = session.users.get(userId);

    // notify all client that user left
    const leaveMsg: UserLeaveMessage = {
        type: 'user_leave',
        payload: user
    };
    session.wss.clients.forEach(socket => {
        if (socket.readyState === OPEN) {
            socket.send(JSON.stringify(leaveMsg));
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

    wss.on('connection', (socket: WebSocket): void => {
        const session = PlanningSessionWorker.getInstance().getSession(sessionId);
        if (!session) {
            socket.close();
            return;
        }

        // generate userId
        let userId = generateId();
        while (userIds.includes(userId)) {
            userId = generateId();
        }
        userIds.push(userId);

        socket.on('message', (data: Data) => handleMessage(sessionId, userId, socket, data));
        socket.on('close', () => handleClose(sessionId, userId));
    });

    return wss;
};
