<template>
<div>
    <Error
        v-if="error"
        @button="setupSocket"
        description="Konnte nicht zu Session verbinden. Vielleicht exsistiert die Session nicht?"
        button="Erneut versuchen!"
    />
    <template v-else-if="controller !== null">
        <Map
            :controller="controller"
            :features="features"
            mapId="stratis"
            v-model="map"
            @highlight-feature="highlightedFeature = $event;"
            @edit-feature="editFeature($event);"
            @delete-feature="deleteFeature($event);"
        />
        <Toolbar v-model="activeTool" />
    </template>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as WebSocket from 'ws';
import { Map } from 'leaflet';

import { User, Feature, Marker, Comment, Message, CreateFeatureMessage, DeleteFeatureMessage, updateFeatures } from '@/services/shared';

import { WebSocketController } from '@/services/websocket';
import MapVue from '@/components/Session/Map.vue';
import ToolbarVue from '@/components/Session/Toolbar.vue';

import Tool from '@/tools/Tool';
import LineTool from '@/tools/Line';
import { addLine, deleteFeature } from '@/services/feature';

@Component({
    components: {
        Map: MapVue,
        Toolbar: ToolbarVue
    }
})
export default class SessionVue extends Vue {
    @Prop({ default: '' }) private id!: string;

    private nickname: string = '';
    private color: string = '#d18d1f';
    private error: Error|null = null;
    private controller: WebSocketController|null = null;
    private connected: boolean = false;

    private features: Feature[] = [];
    private users: User[] = [];
    private activeTool: string = 'pan';
    private map: Map|null = null;

    private prevTool: string = '';

    private tool: Tool|null = null;

    private highlightedFeature: Feature|null = null;

    private created() {
        if (this.id === '') this.$router.push('/');
        window.addEventListener('keydown', this.onKeyDown);

        this.setupSocket();
    }

    private beforeDestroy() {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    private setupSocket() {
        if (this.controller) this.controller.close();

        this.controller = new WebSocketController(this.id);
        this.controller.on('error', err => this.onSocketError(err));
        this.controller.on('open', () => this.onSocketOpened());
        this.controller.on('close', () => this.onSocketClosed());
        this.controller.on('message', msg => this.onSocketMessage(msg));
    }

    private onSocketError(err: Error) {
        this.error = err;
        // eslint-disable-next-line no-console
        console.log('socker error', err);
    }

    private onSocketOpened() {
        // eslint-disable-next-line no-console
        console.log('socket opened');
        this.connected = true;
    }

    private onSocketClosed() {
        // eslint-disable-next-line no-console
        console.log('socket closed');
        this.connected = false;
    }

    private onSocketMessage(msg: Message) {
        // eslint-disable-next-line no-console
        console.log('socket message recieved', msg);

        if (['delete_feature', 'create_feature', 'edit_feature', 'init_features'].includes(msg.type)) {
            this.features = updateFeatures(this.features, msg);
        }

        // eslint-disable-next-line no-console
        console.log(JSON.stringify(this.features.map(f => ({ type: f.type, id: f.id }))));
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
        case 'ControlLeft':
            this.tempSwitchTool('line', event.code);
            break;
        case 'Delete':
            if (this.highlightedFeature) this.deleteFeature(this.highlightedFeature);
            break;
        }
    }

    private deleteFeature(feature: Feature) {
        if (!this.controller) return;

        deleteFeature(this.controller, feature.id);
    }

    private editFeature(feature: Feature) {
        // eslint-disable-next-line no-console
        console.log('edit feature', feature);
    }

    private tempSwitchTool(tool: string, keyCode: string) {
        if (this.prevTool !== '') return;

        this.prevTool = this.activeTool;

        this.activeTool = tool;

        const handler = (event2: KeyboardEvent) => {
            if (event2.code !== keyCode) return;
            window.removeEventListener('keyup', handler);

            this.activeTool = this.prevTool;
            this.prevTool = '';
        };

        window.addEventListener('keyup', handler);
    }

    @Watch('activeTool')
    private onToolChanged() {
        if (!this.map) return;

        if (this.tool) this.tool.destroy();

        switch (this.activeTool) {
        case 'line':
            const lineTool = new LineTool(this.map);
            lineTool.onCreate = coords => {
                if (!this.controller) return;
                addLine(this.controller, coords, 'black');
            };
            this.tool = lineTool;
            break;

        default:
            break;
        }
    }
}
</script>

<style lang="scss">
.grad-group {
    background-color: white;
    box-shadow: 0px 0.25rem .5rem rgba(0, 0, 0, 0.125);
    border-radius: .25rem;
}
</style>
