<template>
    <div style="position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px;" ref="map"></div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Map as LeafletMap, TileLayer, LeafletMouseEvent, GeoJSON, Layer } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { WebSocketController } from '@/services/websocket';
import { Feature, Line } from '@/services/shared';
import { LineString } from 'geojson';

@Component
export default class MapVue extends Vue {
    @Prop({ default: null }) private value!: LeafletMap|null;

    @Prop({ required: true }) private controller!: WebSocketController;
    @Prop({ default: [] }) private features!: Feature[];
    @Prop({ required: true }) private mapId!: string;

    private featureLayers: Map<string, Layer> = new Map<string, Layer>();

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

        this.featureLayers.forEach((layer, id) => {
            layer.remove();
        });

        this.featureLayers.clear();

        this.features.forEach(f => {
            let layer: Layer|null = null;

            switch (f.type) {
            case 'line':
                layer = this.createLine(f as Line).addTo(this.map!);
                break;

            default:
                break;
            }

            if (layer) this.featureLayers.set(f.id, layer);
        });
    }

    private selectFeature(feature: Feature|null) {
        this.$emit('select-feature', feature);
    }

    private createLine(line: Line): GeoJSON {
        const style = {
            color: line.color,
            weight: 2,
            opacity: 0.5
        };

        const geoJson = new GeoJSON({
            type: 'LineString',
            coordinates: line.positions
        } as LineString, {
            style
        });

        geoJson.on('mouseover', (ev) => {
            geoJson.setStyle({
                ...style,
                color: 'red'
            });
            this.selectFeature(line);
        });

        geoJson.on('mouseout', () => {
            geoJson.setStyle(style);
            this.selectFeature(null);
        });

        return geoJson;
    }
}
</script>
