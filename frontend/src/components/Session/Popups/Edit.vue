<template>
<Popup
    v-if="feature"
    class="grad-group grad-edit-popup"
    :pos="feature.pos"
>
    <MarkerForm v-if="feature.type === 'marker'" v-model="featureCopy" />
    <CommentForm v-if="feature.type === 'comment'" v-model="featureCopy" />
    <PictureForm v-if="feature.type === 'picture'" v-model="featureCopy" />
    <template v-slot:action-btns>
        <grad-icon-btn
            @click="duplicateFeature"
            icon="content_copy"
            tooltip="Duplicate"
        />
        <grad-icon-btn
            @click="deleteFeature"
            icon="delete"
            tooltip="Delete"
        />
        <grad-icon-btn
            @click="feature = null;"
            icon="close"
            tooltip="Close"
        />
        <grad-icon-btn
            @click="editFeature"
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
import { LatLng, Layer as LeafletLayer, Map as LeafletMap, LeafletMouseEvent } from 'leaflet';
import MarkerFormVue from './Forms/Marker.vue';
import CommentFormVue from './Forms/Comment.vue';
import PictureFormVue from './Forms/Picture.vue';

import CommentFeature from '@/features/Comment';
import MarkerFeature from '@/features/Marker';
import FeatureInteractionEvent from '@/features/FeatureInteractionEvent';

@Component({
    components: {
        Popup: PopupVue,
        MarkerForm: MarkerFormVue,
        CommentForm: CommentFormVue,
        PictureForm: PictureFormVue
    }
})
export default class EditPopupVue extends Vue {
    private featureCopy: Feature|null = null;
    private previewFeature: LeafletLayer|null = null;
    private feature: Feature|null = null;

    private created() {
        this.createFeatureCopy();
        this.setupMap();
    }

    @Watch('$tstore.state.map')
    private setupMap() {
        if (this.$tstore.state.map === null) return;

        // Typscript doesn't like that we use a event type which isn't
        // specified as a overload of the addEventListener function
        // @ts-ignore
        this.$tstore.state.map.addEventListener('grad/feature/dblclick', (event: FeatureInteractionEvent) => {
            if (!['picture', 'comment', 'marker'].includes(event.gradFeature.type)) return;

            this.feature = event.gradFeature;
        });

        this.$tstore.state.map.addEventListener('click', () => {
            if (this.feature !== null) this.feature = null;
        });
    }

    @Watch('feature', { deep: true })
    private createFeatureCopy() {
        if (this.feature === null) {
            this.featureCopy = null;
        } else {
            this.featureCopy = JSON.parse(JSON.stringify(this.feature)) as Feature;
        }
    }

    @Watch('featureCopy', { deep: true })
    private updatePreviewFeature() {
        // remove old feature if there is one
        if (this.previewFeature !== null) {
            this.previewFeature.remove();
            this.previewFeature = null;
        };

        if (this.featureCopy === null) return;

        switch (this.featureCopy.type) {
        case 'comment':
            this.previewFeature = new CommentFeature(this.featureCopy as Comment, false);
            break;
        case 'picture':
            // feature = this.picture;
            break;
        default:
            this.previewFeature = new MarkerFeature(this.featureCopy as Marker, false);
            break;
        }

        if (this.previewFeature === null) return;
        if (this.$tstore.state.map === null) return;
        this.previewFeature.addTo(this.$tstore.state.map);
    }

    private duplicateFeature() {
        if (this.$tstore.state.featureService === null) return;
        if (this.feature === null) return;
        this.$tstore.state.featureService.createFeature(this.feature);

        this.feature = null;
    }

    private deleteFeature() {
        if (this.$tstore.state.featureService === null) return;
        if (this.feature === null) return;

        this.$tstore.state.featureService.deleteFeature(this.feature.id);

        this.feature = null;
    }

    private editFeature() {
        if (this.$tstore.state.featureService === null) return;
        if (this.featureCopy === null) return;
        this.$tstore.state.featureService.updateFeature(this.featureCopy);

        this.feature = null;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-edit-popup {
    width: calc(262.5px);
}
</style>
