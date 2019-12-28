<template>
<div class="grad-connection-idicator grad-group">
    <i v-if="connected === null" class="material-icons">signal_cellular_null</i>
    <i v-else-if="connected" class="material-icons" style="color: #66AA66;">signal_cellular_4_bar</i>
    <i v-else class="material-icons" style="color: #AA6666;">signal_cellular_connected_no_internet_4_bar</i>

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
}
</script>

<style lang="scss" scoped>
.grad-connection-idicator {
    display: flex;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem;
}
</style>
