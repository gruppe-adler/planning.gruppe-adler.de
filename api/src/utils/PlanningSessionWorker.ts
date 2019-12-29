import PlanningSession from '../types/PlanningSession';
import createWSS from './websocket';

const CLEANUP_TIMER = (60 * 1000);

export default class PlanningSessionWorker {
    // singleton shizzle
    private static instance: PlanningSessionWorker|null = null;
    private sessions: Map<string, PlanningSession>;

    private constructor() {
        setInterval(this.removeEmptySessions.bind(this), CLEANUP_TIMER);

        this.sessions = new Map<string, PlanningSession>();
    }

    public static getInstance(): PlanningSessionWorker {
        if (this.instance === null) this.instance = new PlanningSessionWorker();
        return this.instance;
    }

    /**
     * Executed by interval. Iterates all sessions and deletes the empty ones.
     */
    private removeEmptySessions(): void {
        const now = (new Date()).getTime();

        this.sessions.forEach((session, id) => {
            // exit if session exists for less then CLEANUP_TIMER
            if (now - session.createdAt < CLEANUP_TIMER) return;

            // ping all clients
            session.wss.clients.forEach(c => c.ping());

            if (session.wss.clients.size === 0) {
                session.wss.close();
                this.sessions.delete(id);

                console.log(`deleting empty planning session ${id}`);
            } else {
                console.log(`skipping planning session ${id}`, session.wss.clients.size);
            }
        });
    }

    /**
     * Check if session with given id exists.
     * @param id Session id
     * @returns Sessions exists?
     */
    public getSession(id: string): PlanningSession|undefined {
        return this.sessions.get(id);
    }

    /**
     * Create new session
     * @returns Id of new session
     */
    public newSession(map: string): string {
        // generate new (unused) id
        const generateId = (): string => Math.ceil((Math.random() * 1000000000000000)).toString(16);
        let id = generateId();
        while (this.sessions.has(id)) {
            id = generateId();
        }

        const session = new PlanningSession(id, map, createWSS(id));
        this.sessions.set(id, session);

        return id;
    }
}
