<template>
<div class="grad-connection-idicator grad-group">
    <grad-icon-btn
        :disabled="true"
        tooltip-pos="left"
        :icon="icon"
        :tooltip="`Status (${status})`"
    >
        <template v-slot:icon="{ icon }">
            <i class="material-icons" :style="`color: ${connected ? '#66AA66' : '#AA6666'}; opacity: 1;`">{{icon}}</i>
        </template>
    </grad-icon-btn>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { WebSocketController } from '@/services/websocket';

interface Setting {
    id: string;
    displayName: string;
    icon: string;
}

@Component
export default class ConnectionIndicatorVue extends Vue {
    @Prop({ default: null }) private controller!: null|WebSocketController;

    private connected: boolean|null = null;

    private created() {
        this.updateStatus();
        this.onControllerChanged();
    }

    @Watch('controller')
    private onControllerChanged() {
        if (this.controller === null) return;

        this.controller.addEventListener('open', () => this.updateStatus());
        this.controller.addEventListener('close', () => this.updateStatus());
        this.controller.addEventListener('error', () => this.updateStatus());

        this.updateStatus();
    }

    private updateStatus() {
        if (this.controller === null) {
            this.connected = null;
            return;
        }

        if (this.controller.readyState === WebSocket.OPEN) {
            this.connected = true;
            return;
        }

        if ([WebSocket.CLOSED, WebSocket.CLOSED].includes(this.controller.readyState)) {
            this.connected = false;
            return;
        }

        this.connected = null;
    }

    private get status(): string {
        if (this.connected === null) return 'unknown';

        return this.connected ? 'connected' : 'disconnected';
    }

    private get icon(): string {
        if (this.connected === null) return 'sync';

        return this.connected ? 'link' : 'link__off';
    }
}
</script>

<style lang="scss" scoped>
.grad-connection-idicator {
    display: flex;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
}
</style>
