<template>
<div
    class="grad-popup grad-group"
    @mousedown.stop
    @mouseup.stop
    @mousewheel.stop
    @click.stop
>
    <div class="grad-popup__tri"></div>
    <slot />
    <div class="grad-popup__action-btns" v-if="$scopedSlots['action-btns']">
        <slot name="action-btns" />
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { WebSocketController } from '@/services/websocket';
import { Comment } from '@/services/shared';
import { LatLng, DivOverlay, Map as LeafletMap } from 'leaflet';
import { mapState } from 'vuex';

class GradPopup extends DivOverlay {
    private _initLayout() {
        // @ts-ignore
        this._contentNode = this._container = document.createElement('div');
    }

    private _updateLayout() {}

    private _adjustPan() {}

    private _animateZoom() {}
}

@Component({
    computed: {
        ...mapState({
            map: (state: any) => state.map
        })
    }
})
export default class PopupVue extends Vue {
    @Prop({ default: null }) private pos!: LatLng|null;

    private overlay: GradPopup|null = null;
    private map!: null|LeafletMap;

    private mounted() {
        this.overlay = new GradPopup();
        this.overlay.setContent(this.$el as HTMLDivElement);
        this.overlay!.setLatLng(new LatLng(0, 0)); // inital pos
    }

    private updated() {
        if (!this.overlay) return;

        this.overlay.setContent(this.$el as HTMLDivElement);
    }

    private destroyed() {
        if (this.overlay) this.overlay.remove();
    }

    @Watch('overlay')
    @Watch('map')
    @Watch('pos')
    private reposition() {
        if (!this.overlay || !this.map) return;

        // TODO: make sure this only happens once
        this.overlay.addTo(this.map); // add it once to make sure it was added at some point to the map

        if (!this.pos) {
            this.overlay.removeFrom(this.map);
        } else {
            this.overlay!.setLatLng(this.pos);
            this.overlay.addTo(this.map);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-popup {
    transform: translate(-50%, calc(0.75rem + 2rem));
    padding: 1.5rem;
    position: relative;

    &__tri {
        background-color: $color-background;
        border-radius: .25rem;
        transform: translate(-50%, 0) rotate(45deg);
        height: 1.5rem;
        width: 1.5rem;
        position: absolute;
        top: -0.5rem;
        left: 50%;
        z-index: -1;
    }

    &__action-btns {
        width: 100%;
        justify-content: flex-end;
        position: relative;
        bottom: -1.5rem;
        right: -1.5rem;
        display: flex;
    }
}
</style>
