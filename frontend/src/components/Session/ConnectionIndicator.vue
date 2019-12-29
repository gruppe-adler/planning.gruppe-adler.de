<template>
<div class="grad-connection-idicator grad-group">
    <div class="grad-icon-button grad-icon-button--disabled grad-icon-button--tooltip-left">
        <i v-if="connected === null" class="material-icons">sync</i>
        <i v-else-if="connected" class="material-icons" style="color: #66AA66;">link</i>
        <i v-else class="material-icons" style="color: #AA6666;">link__off</i>
        <span class="grad-icon-button__tooltip">Status ({{status}})</span>
    </div>
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

        this.controller.on('open', () => this.updateStatus());
        this.controller.on('close', () => this.updateStatus());
        this.controller.on('error', () => this.updateStatus());

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
