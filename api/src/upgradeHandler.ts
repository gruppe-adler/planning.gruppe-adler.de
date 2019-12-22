import * as URL from 'url';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import PlanningSessionWorker from './utils/PlanningSessionWorker';

const sessionsWorker = PlanningSessionWorker.getInstance();

const pathPattern = /^\/api\/join\/\w+$/i;

const upgradeHandler = (request: IncomingMessage, socket: Socket, head: Buffer): void => {
    const path = URL.parse(request.url).pathname;

    // we only accept requests to correct path
    if (!pathPattern.test(path)) {
        socket.end('HTTP/1.1 404\r\n\r\n');
        return;
    }

    // return if upgrade header doesn't contain websocket
    if (request.headers.upgrade.toLowerCase() !== 'websocket') {
        socket.end('HTTP/1.1 400\r\n\r\n');
        return;
    }

    // extract session id
    const sessionId = path.replace(/^\/api\/join\//i, '');

    // find planning session with given id
    const session = sessionsWorker.getSession(sessionId);

    // return if there is no session with given id
    if (!session) {
        socket.end('HTTP/1.1 404\r\n\r\n');
        return;
    }

    // switch to websocket
    session.wss.handleUpgrade(request, socket, head, ws => {
        session.wss.emit('connection', ws, request);
    });
};


export default upgradeHandler;
