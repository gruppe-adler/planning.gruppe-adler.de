import {
    Feature, Marker, Comment, User, Message, CreateFeatureMessage, DeleteFeatureMessage, Line
} from '@/services/shared';

import { WebSocketController } from './websocket';
import { EditFeatureMessage, UserJoinMessage } from './shared/messages';
import { LatLng } from 'leaflet';

export default class FeatureService {
    private controller: WebSocketController;

    constructor(controller: WebSocketController) {
        this.controller = controller;
    }

    public join(user: User) {
        const msg: UserJoinMessage = {
            type: 'user_join',
            payload: user
        };

        this.controller.send(msg);
    }

    public updateFeature(feature: Partial<Feature> & Pick<Feature, 'id'>): void {
        const msg: EditFeatureMessage = {
            type: 'edit_feature',
            payload: feature
        };

        this.controller.send(msg);
    }

    public createFeature(feature: Feature): void {
        const msg: CreateFeatureMessage = {
            type: 'create_feature',
            payload: feature
        };

        this.controller.send(msg);
    }

    public addComment(pos: [number, number], text: string, author: string): void {
        const comment: Comment = {
            type: 'comment',
            pos,
            text,
            author,
            id: 'temp'
        };

        this.createFeature(comment);
    }

    public addLine(positions: LatLng[], color: string): void {
        const comment: Line = {
            type: 'line',
            positions: positions.map(pos => [pos.lat, pos.lng]),
            color,
            id: 'temp'
        };

        this.createFeature(comment);
    }

    public deleteFeature(id: string): void {
        const msg: DeleteFeatureMessage = {
            type: 'delete_feature',
            payload: { id }
        };
        this.controller.send(msg);
    }
}
