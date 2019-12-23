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

import deepEqual from 'deep-equal';
@Component
export default class MapVue extends Vue {
    @Prop({ default: null }) private value!: LeafletMap|null;

    @Prop({ required: true }) private controller!: WebSocketController;
    @Prop({ default: [] }) private features!: Feature[];
    @Prop({ required: true }) private mapId!: string;

    private featureLayers: Map<string, { feature: Feature, layer: Layer}> = new Map();

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
                layer.on('mouseover', () => this.selectFeature(f));
                layer.on('mouseout', () => this.selectFeature(null));

                this.featureLayers.set(f.id, { feature: f, layer });
            };
        });
    }

    private selectFeature(feature: Feature|null) {
        this.$emit('select-feature', feature);
    }
}
</script>
