<template>
<div class="grad-marker-form">
    <grad-select
        v-model="category"
        :items="categories"
        nameField="displayName"
    />
    <grad-select
        v-model="type"
        :items="categoryMarkers"
    >
        <template v-slot:item="{ item }">
            <img class="grad-marker-form__marker" :src="`/markers/${item.id}.png`" />
            <span>{{item.name}}</span>
        </template>
    </grad-select>
    <input type="text" placeholder="Description" v-model="value.text" />
    <Colors v-model="value.color" :default="type ? type.defaultColor : undefined" />
    <div class="grad-marker-form__sliders">
        <span>Direction</span>
        <grad-slider v-model="value.direction" :min="-180" :max="180">
            {{ value.direction }}°
        </grad-slider>
        <span>Opacity</span>
        <grad-slider v-model="value.opacity" :min="0" :max="1" :steps="0.01">
            {{ (value.opacity * 100).toFixed(0) }}%
        </grad-slider>
        <span>Size</span>
        <grad-slider v-model="value.size" :min="0" :max="5" :steps="0.1">
            {{ value.size.toFixed(1) }}
        </grad-slider>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Marker } from '@/services/shared';
import ColorsVue from './Marker/Colors.vue';
import { PropType } from 'vue';
interface ArmaMarker {
    id: string;
    defaultColor: [number, number, number, number];
    name: string;
    icon: string;
    size: number;
    shadow: number;
    markerClass: string;
    showEditorMarkerColor?: string;
}
interface ArmaMarkerClass {
    id: string;
    displayName: string;
}

const markers: ArmaMarker[] = require('@/assets/markers.json');
const markerClasses: ArmaMarkerClass[] = require('@/assets/marker-classes.json');

@Component({
    components: {
        Colors: ColorsVue
    }
})
export default class MarkerFormVue extends Vue {
    @Prop({ required: true, type: Object as PropType<Marker> }) private value!: Marker;

    private type: ArmaMarker|null = null;

    private categories: ArmaMarkerClass[] = markerClasses;
    private category: ArmaMarkerClass|null = null;

    @Watch('type')
    private updateType() {
        if (this.type === null) return;
        this.value.markerType = this.type.id.toLowerCase();

        this.updateCategory();
    }

    @Watch('value', { deep: true })
    private updateInteralType() {
        const marker = markers.find(m => m.id.toLowerCase() === this.value.markerType.toLowerCase());
        if (marker === undefined) return;
        this.type = marker;

        this.$tstore.commit('setLastMarker', this.value);

        this.updateCategory();
    }

    private updateCategory() {
        if (this.type === null) return;
        const cat = this.categories.find(c => this.type!.markerClass.toLowerCase() === c.id.toLowerCase());
        if (cat === undefined) return;
        this.category = cat;
    }

    private created() {
        this.updateInteralType();
    }

    private get categoryMarkers(): ArmaMarker[] {
        if (this.category === null) return [];

        return markers
            .filter(m => m.markerClass && m.markerClass.toLowerCase() === this.category!.id.toLowerCase())
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    @Watch('category')
    private onCatChanged() {
        if (this.type && this.categoryMarkers.find(m => m.id === this.type!.id) !== undefined) return;

        this.type = this.categoryMarkers[0] || null;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-marker-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    color: rgb($color-inactive);

    > *:not(:last-child) {
        margin-bottom: 1rem;
    }

    &__marker {
        max-height: 80%;
        margin-right: 0.75rem;
    }

    &__sliders {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: .75rem;
        align-items: center;

        > span {
            font-size: 1rem;
            color: rgb($color-active);
        }
    }
}
</style>
