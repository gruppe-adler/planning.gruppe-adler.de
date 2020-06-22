import WebSocket, { Server, Data, OPEN } from 'ws';
import { Message, CreateFeatureMessage, InitMessage, UserJoinMessage, UserLeaveMessage, DeleteFeatureMessage, PointingStartMessage, PointingUpdateMessage, EditFeatureMessage } from '../shared/messages';
import { updateFeatures } from '../shared';
import PlanningSessionWorker from './PlanningSessionWorker';
import { Pointing } from '../shared/features';

const generateId = (): string => Math.ceil((Math.random() * 1000000000000000)).toString(16);
const userIds: string[] = [];
// userId -> pointing feature id
const pointingFeatures: Map<string, string> = new Map();

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
                user: (message as UserJoinMessage).payload,
                map: session.map
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

    if (message.type === 'pointing_update') {
        if (!pointingFeatures.has(userId)) {
            // there is no pointing feature -> change message to pointing_start message
            message = {
                type: 'pointing_start',
                payload: (message as PointingUpdateMessage).payload
            } as PointingStartMessage;
        } else {
            const featureId = pointingFeatures.get(userId);

            const payload: (Pick<Pointing, 'id'> & Partial<Pointing>) = {
                id: featureId,
                pos: (message as PointingUpdateMessage).payload
            };

            message = {
                type: 'edit_feature',
                payload
            } as EditFeatureMessage;
        }
    }

    if (message.type === 'pointing_stop') {
        if (!pointingFeatures.has(userId)) return;

        const featureId = pointingFeatures.get(userId);

        pointingFeatures.delete(userId);

        message = {
            type: 'delete_feature',
            payload: {
                id: featureId
            }
        } as DeleteFeatureMessage;
    }

    if (message.type === 'pointing_start') {
        let id = generateId();
        while (session.features.findIndex(f => f.id === id) >= 0) {
            id = generateId();
        }

        pointingFeatures.set(userId, id);

        if (!session.users.has(userId)) return;

        const user = session.users.get(userId);

        const feature: Pointing = {
            type: 'pointing',
            id,
            user,
            pos: (message as PointingStartMessage).payload
        };

        message = {
            type: 'create_feature',
            payload: feature
        } as CreateFeatureMessage;
    }

    if (['delete_feature', 'create_feature', 'edit_feature', 'init'].includes(message.type)) {
        session.features = updateFeatures(session.features, message);
    }

    // relay to all other clients
    session.wss.clients.forEach(socket => {
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
    session.users.delete(userId);

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
