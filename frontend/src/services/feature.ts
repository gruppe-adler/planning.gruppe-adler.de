import {
    Feature, Marker, Comment, User, Message, CreateFeatureMessage, DeleteFeatureMessage, Line
} from '@/services/shared';

import { WebSocketController } from './websocket';

function createFeature(controller: WebSocketController, feature: Feature): void {
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

export function addLine(controller: WebSocketController, positions: Array<[number, number]>, color: string): void {
    const comment: Line = {
        type: 'line',
        positions,
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
