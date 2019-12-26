<template>
<div style="position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px;" ref="map"></div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Map as LeafletMap, TileLayer, LeafletMouseEvent, GeoJSON, Layer, LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { WebSocketController } from '@/services/websocket';
import { Feature, Line } from '@/services/shared';
import { LineString } from 'geojson';

import LineFeature from '@/services/features/Line';
import Popup from '@/utils/Popup';

import deepEqual from 'deep-equal';

@Component
export default class MapVue extends Vue {
    @Prop({ default: null }) private value!: LeafletMap|null;

    @Prop({ required: true }) private controller!: WebSocketController;
    @Prop({ default: [] }) private features!: Feature[];
    @Prop({ required: true }) private mapId!: string;

    private featureLayers: Map<string, { feature: Feature, layer: Layer}> = new Map();
    private popup?: Popup;
    private popupFeature?: Feature;

    // helper functions for v-model
    // just use this.map to access it
    private get map() { return this.value; }
    private set map(val: LeafletMap|null) { this.$emit('input', val); }

    private mounted() {
        this.map = new LeafletMap(this.$refs.map as HTMLDivElement, {
            attributionControl: false,
            zoomControl: false
        });
    }

    private beforeDestroy() {
        if (this.map) this.map.remove();
    }

    /**
     * This methods sets up the leafelt map.
     */
    @Watch('map')
    private setupMap() {
        if (!this.map) return;

        this.map.setView([0, 0], 0);

        const tl = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
        tl.addTo(this.map!);

        this.map.on('dblclick', (ev: LeafletMouseEvent) => {
            this.$emit('dblckick', ev.latlng);
        });

        this.popup = new Popup();
        this.popup.onEdit = () => this.onPopupEdit();
        this.popup.onDelete = () => this.onPopupDelete();
    }

    @Watch('features')
    private drawFeatures() {
        if (!this.map) return;

        const featuresToRedraw: Feature[] = [];
        const oldFeatureIds = Array.from(this.featureLayers.keys());

        for (const f of this.features) {
            const id = f.id;

            if (!this.featureLayers.has(id)) {
                // completely new feature
                featuresToRedraw.push(f);
                continue;
            }

            const oldFeature = this.featureLayers.get(id)!;
            if (!deepEqual(f, oldFeature.feature)) {
                // feature changed
                oldFeature.layer.remove();
                featuresToRedraw.push(f);
            }

            // remove id from array
            oldFeatureIds.splice(oldFeatureIds.indexOf(id), 1);
        }

        // remove every feature which wasn't included in new features
        for (const id of oldFeatureIds) {
            this.featureLayers.get(id)!.layer.remove();
        }

        featuresToRedraw.forEach(f => {
            let layer: Layer|null = null;

            switch (f.type) {
            case 'line':
                layer = new LineFeature(f as Line).addTo(this.map!);
                break;

            default:
                break;
            }

            if (layer) {
                layer.on('mouseover', () => this.highlightFeature(f));
                layer.on('mouseout', () => this.highlightFeature(null));
                layer.bindPopup(this.popup!);
                layer.on('popupopen', () => { this.popupFeature = f; });

                this.featureLayers.set(f.id, { feature: f, layer });
            };
        });
    }

    private highlightFeature(feature: Feature|null) {
        this.$emit('highlight-feature', feature);
    }

    private onPopupEdit() {
        if (!this.popupFeature) return;
        this.$emit('edit-feature', this.popupFeature);
    }

    private onPopupDelete() {
        if (!this.popupFeature) return;
        this.$emit('delete-feature', this.popupFeature);
    }
}
</script>

<!-- Popup Styles -->
<style lang="scss">
.grad-popup {
    display: flex;
    align-items: center;

    &__wrapper {
        .leaflet-popup-content {
            margin: 0px;
        }

        .leaflet-popup-content-wrapper {
            padding: 0px;
            border-radius: 0.25rem;
        }
    }

    &__tool {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        color: rgba(black,0.5);
        transition: all 0.1s ease-in-out;
        z-index: 0;

        &:not(:last-child)::before {
            content: '';
            position: absolute;
            width: 1px;
            right: 0px;
            bottom: .5rem;
            top: .5rem;
            background-color: #D5D5D5;
        }

        &-tooltip {
            display: none;
            color: white;
            white-space: nowrap;
            background-color: rgba(black, 0.6);
            padding: 8px;
            border-radius: 4px;
            position: absolute;
            font-size: 14px;
            font-weight: bold;
            top: -100%;
            letter-spacing: 0.08em;
            z-index: 2;
            pointer-events: none;
            user-select: none;
        }

        &:hover {
            background-color: rgba(black, 0.05);

            > .grad-popup__tool-tooltip {
                display: initial;
            }
        }

        > i {
            color: inherit;
            user-select: none;
        }
    }
}
</style>
