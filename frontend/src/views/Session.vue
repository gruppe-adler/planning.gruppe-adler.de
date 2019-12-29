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
        <Settingsbar />
        <ConnectionIndicator :controller="controller" />
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
import SettingsbarVue from '@/components/Session/Settingsbar.vue';
import ConnectionIndicatorVue from '@/components/Session/ConnectionIndicator.vue';

import Tool from '@/tools/Tool';
import LineTool from '@/tools/Line';
import { addLine, deleteFeature } from '@/services/feature';

@Component({
    components: {
        Map: MapVue,
        Toolbar: ToolbarVue,
        ConnectionIndicator: ConnectionIndicatorVue,
        Settingsbar: SettingsbarVue
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

        if (this.$store.state.user === null) {
            this.$router.push(`/join/${this.id}`);
            return;
        }

        window.addEventListener('keydown', this.onKeyDown);

        this.$store.commit('setSessionId', this.id);

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
            this.$store.commit('setFeatures', this.features);
        }
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

        // reset highlighted feature if it is deleted
        if (this.highlightedFeature && this.highlightedFeature.id === feature.id) {
            this.highlightedFeature = null;
        }

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

.grad-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    color: rgba(black,0.5);

    &:not(:last-child)::before {
        content: '';
        position: absolute;
        width: 1px;
        right: 0px;
        bottom: .5rem;
        top: .5rem;
        background-color: #D5D5D5;
    }

    > i {
        color: inherit;
        user-select: none;
        padding: 0.75rem;

        &:hover {
            background-color: rgba(black, 0.05);

            ~ .grad-icon-button__tooltip {
                display: initial;
            }
        }
    }

    &__tooltip {
        display: none;
        color: white;
        white-space: nowrap;
        background-color: rgba(black, 0.6);
        padding: 8px;
        border-radius: 4px;
        position: absolute;
        font-size: 14px;
        font-weight: bold;
        top: calc(100% + 4px);
        letter-spacing: 0.08em;
        z-index: 2;
        pointer-events: none;
        user-select: none;
    }

    &--no-seperator::before {
        background-color: transparent !important;
    }

    &--tooltip-top > #{&}__tooltip {
        top: 0px;
        transform: translateY(calc(-100% - 4px));
    }

    &--tooltip-left > #{&}__tooltip {
        top: initial;
        left: 0px;
        transform: translateX(calc(-100% - 4px));
    }

    &--dense > i {
        padding: .5rem;
    }

    &--disabled {
        cursor: default;
        color: rgba(black, 0.25);

        > i:hover {
            background-color: transparent;
        }
    }

    &--active {
        color: #66AA66;
    }
}
</style>
