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
            mapId="stratis"
            v-model="map"
            @highlight-feature="highlightedFeature = $event;"
        />
        <CreatePopup />
        <EditPopup />
        <Toolbar v-model="activeTool" />
        <Settingsbar />
        <ConnectionIndicator :controller="controller" />
    </template>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as WebSocket from 'ws';
import { LatLng } from 'leaflet';

import { User, Feature, Message, InitMessage, UserJoinMessage, UserLeaveMessage, updateFeatures } from '@/services/shared';

import { WebSocketController } from '@/services/websocket';
import MapVue from '@/components/Session/Map.vue';
import ToolbarVue from '@/components/Session/Toolbar.vue';
import SettingsbarVue from '@/components/Session/Settingsbar.vue';
import ConnectionIndicatorVue from '@/components/Session/ConnectionIndicator.vue';

import Tool from '@/tools/Tool';
import LineTool, { LineCreateEvent } from '@/tools/Line';
import PointingTool from '@/tools/Pointing';
import FeatureService from '@/services/feature';
import PointingService from '@/services/pointing';
import CreatePopupVue from '@/components/Session/Popups/Create.vue';
import EditPopupVue from '@/components/Session/Popups/Edit.vue';
import { GradMap } from '@gruppe-adler/maps-frontend-utils';

@Component({
    components: {
        Map: MapVue,
        Toolbar: ToolbarVue,
        ConnectionIndicator: ConnectionIndicatorVue,
        Settingsbar: SettingsbarVue,
        CreatePopup: CreatePopupVue,
        EditPopup: EditPopupVue
    }
})
export default class SessionVue extends Vue {
    @Prop({ default: '' }) private id!: string;

    private error: Error|null = null;
    private controller: WebSocketController|null = null;
    private pointingService: PointingService|null = null;

    private get featureService(): FeatureService|null {
        return this.$tstore.state.featureService;
    };
    private set featureService(service: FeatureService|null) {
        this.$tstore.commit('setFeatureService', service);
    };

    private features: Feature[] = [];
    private users: User[] = [];
    private activeTool: string = 'pan';
    private map: GradMap|null = null;

    private prevTool: string = '';

    private tool: Tool|null = null;

    private highlightedFeature: Feature|null = null;

    private created() {
        if (this.id === '') this.$router.push('/');

        if (this.$tstore.state.user === null) {
            this.$router.push(`/join/${this.id}`);
            return;
        }

        window.addEventListener('keydown', this.onKeyDown);

        this.$tstore.commit('setSessionId', this.id);

        this.setupSocket();
    }

    private beforeDestroy() {
        window.removeEventListener('keydown', this.onKeyDown);
    }

    private setupSocket() {
        if (this.controller) this.controller.close();

        this.controller = new WebSocketController(this.id);
        this.controller.on('error', err => this.onSocketError(err));
        this.controller.on('message', msg => this.onSocketMessage(msg));
        this.controller.on('open', () => this.onSocketConnect());

        this.featureService = new FeatureService(this.controller);
        this.pointingService = new PointingService(this.controller);
    }

    private onSocketError(err: Error) {
        this.error = err;
        // eslint-disable-next-line no-console
        console.log('socker error', err);
    }

    private onSocketMessage(msg: Message) {
        // eslint-disable-next-line no-console
        console.log('socket message recieved', msg);

        if (['delete_feature', 'create_feature', 'edit_feature', 'init'].includes(msg.type)) {
            this.features = updateFeatures(this.features, msg);
            this.$tstore.commit('setFeatures', this.features);
        }

        // save user
        if (msg.type === 'init') {
            this.$tstore.commit('setUser', {
                ...this.$tstore.state.user,
                ...(msg as InitMessage).payload.user
            });
            this.$tstore.commit('setWorldName', (msg as InitMessage).payload.map);
        }

        if (msg.type === 'user_join' || msg.type === 'user_leave') {
            const name = (msg as UserJoinMessage|UserLeaveMessage).payload.nick;
            // eslint-disable-next-line no-console
            console.log(name, msg.type === 'user_join' ? 'joined' : 'left');
        }
    }

    private onSocketConnect() {
        const user = JSON.parse(JSON.stringify(this.$tstore.state.user!));
        delete user.remember;
        this.featureService!.join(user);
    }

    private onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
        case 'ControlLeft':
            this.tempSwitchTool('line', event.code);
            break;
        case 'Delete':
            if (this.highlightedFeature && this.featureService) this.featureService.deleteFeature(this.highlightedFeature.id);
            break;
        case 'ShiftLeft':
            this.tempSwitchTool('pointing', event.code);
            break;
        }
    }

    private tempSwitchTool(tool: string, keyCode: string) {
        if (this.prevTool !== '') return;

        this.prevTool = this.activeTool;

        this.activeTool = tool;

        const handler = (event2: KeyboardEvent) => {
            if (event2.code !== keyCode) return;
            this.activeTool = this.prevTool;
            this.prevTool = '';
        };

        window.addEventListener('keyup', handler, { once: true });
    }

    @Watch('activeTool')
    private onToolChanged() {
        if (!this.map) return;

        if (this.tool) this.tool.destroy();

        switch (this.activeTool) {
        case 'line':
            const lineTool = new LineTool(this.map);
            lineTool.addEventListener('create', (event: Event) => {
                if (!this.featureService) return;

                this.featureService.addLine((event as LineCreateEvent).coords, 'ColorBlack');
            });
            this.tool = lineTool;
            break;
        case 'pointing':
            const pointTool = new PointingTool(this.map);
            pointTool.addEventListener('start', ({ pos }) => {
                if (this.pointingService === null) return;
                this.pointingService.start(pos);
            });
            pointTool.addEventListener('update', ({ pos }) => {
                if (this.pointingService === null) return;
                this.pointingService.update(pos);
            });
            pointTool.addEventListener('stop', event => {
                if (this.pointingService === null) return;
                this.pointingService.stop();
            });
            this.tool = pointTool;
            break;
        default:
            break;
        }
    }
}
</script>

<style lang="scss">
@import '~@/colors.scss';

.grad-group {
    background-color: $color-background;
    box-shadow: 0px 0.25rem .5rem rgba(0, 0, 0, 0.125);
    border-radius: .25rem;
}

.grad-marker, .grad-pointing {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: visible;

    > img {
        flex-shrink: 0;
    }

    > span {
        white-space: nowrap;
        font-weight: bold;
        font-size: 1rem;
        margin-left: .25rem;
        pointer-events: none;
    }
}
</style>
