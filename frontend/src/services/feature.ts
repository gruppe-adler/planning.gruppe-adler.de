import {
    Feature, Marker, Comment, User, Message, CreateFeatureMessage, DeleteFeatureMessage, Line
} from '@/services/shared';

import { WebSocketController } from './websocket';
import { EditFeatureMessage, UserJoinMessage } from './shared/messages';
import { LatLng } from 'leaflet';

export function join(controller: WebSocketController, user: User) {
    const msg: UserJoinMessage = {
        type: 'user_join',
        payload: user
    };

    controller.send(msg);
}

export function updateFeature(controller: WebSocketController, feature: Partial<Feature> & Pick<Feature, 'id'>): void {
    const msg: EditFeatureMessage = {
        type: 'edit_feature',
        payload: feature
    };

    controller.send(msg);
}

export function createFeature(controller: WebSocketController, feature: Feature): void {
    const msg: CreateFeatureMessage = {
        type: 'create_feature',
        payload: feature
    };

    controller.send(msg);
}

export function addComment(controller: WebSocketController, pos: [number, number], text: string, author: string): void {
    const comment: Comment = {
        type: 'comment',
        pos,
        text,
        author,
        id: 'temp'
    };

    createFeature(controller, comment);
}

export function addLine(controller: WebSocketController, positions: LatLng[], color: string): void {
    const comment: Line = {
        type: 'line',
        positions: positions.map(pos => [pos.lat, pos.lng]),
        color,
        id: 'temp'
    };

    createFeature(controller, comment);
}

export function deleteFeature(controller: WebSocketController, id: string): void {
    const msg: DeleteFeatureMessage = {
        type: 'delete_feature',
        payload: { id }
    };
    controller.send(msg);
}
