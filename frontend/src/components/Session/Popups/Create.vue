<template>
<Popup
    :pos="pos"
    class="grad-group grad-create-popup"
>
    <div class="grad-create-popup__tabs">
        <div :class="tabClasses('marker')" @click="tab = 'marker'">
            <i class="material-icons">location_on</i>
            <span>Marker</span>
        </div>
        <div :class="tabClasses('comment')" @click="tab = 'comment'">
            <i class="material-icons">comment</i>
            <span>Comment</span>
        </div>
        <div :class="tabClasses('picture')" @click="tab = 'picture'">
            <i class="material-icons">photo</i>
            <span>Image</span>
        </div>
    </div>
    <MarkerForm v-show="tab === 'marker'" v-model="marker" />
    <CommentForm v-show="tab === 'comment'" v-model="comment" />
    <PictureForm v-show="tab === 'picture'" v-model="picture" />
    <template v-slot:action-btns>
        <grad-icon-btn
            @click="pos = null;"
            icon="close"
            tooltip="Abort"
        />
        <grad-icon-btn
            @click="submit"
            icon="done"
            tooltip="Create"
        />
    </template>
</Popup>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { WebSocketController } from '@/services/websocket';
import { Comment, Marker, Picture, Feature } from '@/services/shared';
import PopupVue from './Popup.vue';
import { LatLng, Layer as LeafletLayer } from 'leaflet';
import MarkerFormVue from '../Forms/Marker.vue';
import CommentFormVue from '../Forms/Comment.vue';
import PictureFormVue from '../Forms/Picture.vue';

import CommentFeature from '@/services/features/Comment';
import MarkerFeature from '@/services/features/Marker';

@Component({
    components: {
        Popup: PopupVue,
        MarkerForm: MarkerFormVue,
        CommentForm: CommentFormVue,
        PictureForm: PictureFormVue
    }
})
export default class CreatePopupVue extends Vue {
    @Prop({ default: null }) private value!: LatLng|null;

    private get pos() { return this.value; };
    private set pos(v: LatLng|null) { this.$emit('input', v); };

    private tab: 'marker'|'comment'|'picture' = 'marker';

    private previewFeature: LeafletLayer|null = null;

    private comment: Comment = {
        id: 'temp',
        type: 'comment',
        text: '',
        author: this.$store.state.user.name,
        pos: [0, 0]
    };

    private marker: Marker = {
        id: 'temp',
        type: 'marker',
        text: '',
        direction: 0,
        color: '',
        markerType: 'Dot',
        pos: [0, 0],
        opacity: 1
    };

    private picture: Picture = {
        id: 'temp',
        type: 'picture',
        direction: 0,
        pos: [0, 0],
        text: '',
        url: '',
        width: 100,
        height: 100,
        opacity: 1
    };

    private submit() {
        let feature: Feature;

        switch (this.tab) {
        case 'comment':
            feature = this.comment;
            break;
        case 'picture':
            feature = this.picture;
            break;
        default:
            feature = this.marker;
            break;
        };

        this.$emit('submit', feature);
    }

    private deletePreview() {
        if (this.previewFeature === null) return;
        this.previewFeature.remove();
        this.previewFeature = null;
    }

    @Watch('comment', { deep: true })
    @Watch('picture', { deep: true })
    @Watch('marker', { deep: true })
    @Watch('tab')
    @Watch('pos')
    private updatePreviewFeature() {
        // remove old feature if there is one
        this.deletePreview();

        if (this.pos === null) return;

        switch (this.tab) {
        case 'comment':
            this.previewFeature = new CommentFeature(this.comment);
            break;
        case 'picture':
            // feature = this.picture;
            break;
        default:
            this.previewFeature = new MarkerFeature(this.marker);
            break;
        }

        if (this.previewFeature === null) return;

        this.previewFeature.addTo(this.$store.state.map);
    }

    @Watch('pos')
    private setupFeatures() {
        if (this.pos === null) return;

        const pos: [number, number] = [this.pos.lat, this.pos.lng];

        this.comment = {
            id: 'temp',
            type: 'comment',
            text: '',
            author: this.$store.state.user.name,
            pos
        };

        this.marker = {
            id: 'temp',
            type: 'marker',
            text: '',
            direction: 0,
            color: 'GRAD_DEFAULT_COLOR',
            markerType: 'hd_objective',
            pos,
            opacity: 1
        };

        this.picture = {
            id: 'temp',
            type: 'picture',
            direction: 0,
            pos,
            text: '',
            url: '',
            width: 100,
            height: 100,
            opacity: 1
        };
    }

    private tabClasses(id: string) {
        return [id === this.tab ? 'grad-create-popup--active-tab' : ''];
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-create-popup {
    width: calc(262.5px);

    &__tabs {
        margin-bottom: 1.5rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-column-gap: 1rem;
        cursor: pointer;
        color: $color-inactive;

        > div {
            color: inherit;
            transition: color .5s ease-in-out;
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
            grid-row-gap: 0.25rem;
            justify-items: center;

            > span {
                text-transform: uppercase;
                font-size: 0.875rem;
            }
        }
    }

    &--active-tab {
        color: $color-active !important;
    }
}
</style>
