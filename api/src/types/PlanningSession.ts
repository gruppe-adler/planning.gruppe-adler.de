import { Server } from 'ws';
import { Feature } from '../shared/features';
import { User } from '../shared/users';

export default class PlanningSession {
    public id: string;
    public features: Feature[];
    // public users: User[];
    public map: string;
    public wss: Server;
    // public clients: Map<string,
    public createdAt: number;
    public users: Map<string, User> = new Map();

    constructor(id: string, map: string, server: Server) {
        this.id = id;
        this.features = [];
        this.map = map;
        this.wss = server;
        this.createdAt = (new Date()).getTime();
    }
}
