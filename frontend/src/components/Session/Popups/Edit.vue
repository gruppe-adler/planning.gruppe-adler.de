<template>
<Popup
    v-if="value"
    class="grad-group grad-edit-popup"
    :pos="value.pos"
>
    <MarkerForm v-if="value.type === 'marker'" v-model="valueCopy" />
    <CommentForm v-if="value.type === 'comment'" v-model="valueCopy" />
    <PictureForm v-if="value.type === 'picture'" v-model="valueCopy" />
    <template v-slot:action-btns>
        <grad-icon-btn
            @click="$emit('duplicate', value);"
            icon="content_copy"
            tooltip="Duplicate"
        />
        <grad-icon-btn
            @click="$emit('delete', value)"
            icon="delete"
            tooltip="Delete"
        />
        <grad-icon-btn
            @click="$emit('input', null)"
            icon="close"
            tooltip="Close"
        />
        <grad-icon-btn
            @click="$emit('submit', valueCopy)"
            icon="done"
            tooltip="Submit"
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
import MarkerFormVue from './Forms/Marker.vue';
import CommentFormVue from './Forms/Comment.vue';
import PictureFormVue from './Forms/Picture.vue';

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
export default class EditPopupVue extends Vue {
    @Prop({ default: null }) private value!: Feature|null;

    private valueCopy: Feature|null = null;

    private created() {
        this.createValueCopy();
    }

    @Watch('value', { deep: true })
    private createValueCopy() {
        if (this.value === null) {
            this.valueCopy = null;
        } else {
            this.valueCopy = JSON.parse(JSON.stringify(this.value)) as Feature;
        }
    }

    private previewFeature: LeafletLayer|null = null;

    private deletePreview() {
        if (this.previewFeature === null) return;
        this.previewFeature.remove();
        this.previewFeature = null;
    }

    @Watch('valueCopy', { deep: true })
    private updatePreviewFeature() {
        // remove old feature if there is one
        this.deletePreview();

        if (this.valueCopy === null) return;

        switch (this.valueCopy.type) {
        case 'comment':
            this.previewFeature = new CommentFeature(this.valueCopy as Comment);
            break;
        case 'picture':
            // feature = this.picture;
            break;
        default:
            this.previewFeature = new MarkerFeature(this.valueCopy as Marker);
            break;
        }

        if (this.previewFeature === null) return;

        this.previewFeature.addTo(this.$store.state.map);
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-edit-popup {
    width: calc(262.5px);
}
</style>
