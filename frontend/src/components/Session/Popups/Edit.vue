<template>
<Popup
    v-if="feature"
    class="grad-group grad-edit-popup"
    :pos="pos || feature.pos"
>
    <MarkerForm v-if="feature.type === 'marker'" v-model="featureCopy" />
    <CommentForm v-if="feature.type === 'comment'" v-model="featureCopy" />
    <PictureForm v-if="feature.type === 'picture'" v-model="featureCopy" />
    <LineForm v-if="feature.type === 'line'" v-model="featureCopy" />
    <template v-slot:action-btns>
        <grad-icon-btn
            v-if="canCopy"
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
            @click="close"
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
import { Comment, Marker, Picture, Feature, Line } from '@/services/shared';
import PopupVue from './Popup.vue';
import { LatLng, Layer as LeafletLayer, LeafletMouseEvent } from 'leaflet';
import MarkerFormVue from './Forms/Marker.vue';
import CommentFormVue from './Forms/Comment.vue';
import PictureFormVue from './Forms/Picture.vue';
import LineFormVue from './Forms/Line.vue';

import CommentFeature from '@/features/Comment';
import MarkerFeature from '@/features/Marker';
import LineFeature from '@/features/Line';
import FeatureInteractionEvent from '@/features/FeatureInteractionEvent';

@Component({
    components: {
        Popup: PopupVue,
        MarkerForm: MarkerFormVue,
        CommentForm: CommentFormVue,
        PictureForm: PictureFormVue,
        LineForm: LineFormVue
    }
})
export default class EditPopupVue extends Vue {
    private featureCopy: Feature|null = null;
    private previewFeature: LeafletLayer|null = null;
    private feature: Feature|null = null;
    private pos: LatLng|null = null;

    private created() {
        this.onFeatureChanged();
        this.setupMap();
    }

    @Watch('$tstore.state.map')
    private setupMap() {
        if (this.$tstore.state.map === null) return;

        // Typscript doesn't like that we use a event type which isn't
        // specified as a overload of the addEventListener function
        // @ts-ignore
        this.$tstore.state.map.addEventListener('grad/feature/dblclick', (event: FeatureInteractionEvent) => {
            if (!['picture', 'comment', 'marker', 'line'].includes(event.gradFeature.type)) return;

            this.feature = event.gradFeature;

            if (event.gradFeature.type === 'line') {
                this.pos = event.latlng;
            }
        });

        this.$tstore.state.map.addEventListener('click', () => {
            this.close();
        });
    }

    @Watch('feature', { deep: true })
    private onFeatureChanged() {
        if (this.featureCopy !== null) this.$store.commit('unhideFeature', this.featureCopy);

        if (this.feature === null) {
            this.featureCopy = null;
        } else {
            this.featureCopy = JSON.parse(JSON.stringify(this.feature)) as Feature;
            this.$store.commit('hideFeature', this.featureCopy);
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
        case 'line':
            this.previewFeature = new LineFeature(this.featureCopy as Line, false);
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
        this.close();
    }

    private deleteFeature() {
        if (this.$tstore.state.featureService === null) return;
        if (this.feature === null) return;

        this.$tstore.state.featureService.deleteFeature(this.feature.id);
        this.close();
    }

    private editFeature() {
        if (this.$tstore.state.featureService === null) return;
        if (this.featureCopy === null) return;

        this.$tstore.state.featureService.updateFeature(this.featureCopy);
        this.close();
    }

    private close() {
        this.feature = null;
        this.pos = null;
    }

    private get canCopy(): boolean {
        return (this.feature !== null && this.feature.type !== 'line');
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-edit-popup {
    width: calc(262.5px);
}
</style>
