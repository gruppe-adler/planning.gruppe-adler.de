<template>
    <img :src="url" :alt="type" />
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { rgbToHex, getHexColoredMarkerURL } from '@/utils/color';

@Component
export default class MarkerImgVue extends Vue {
    @Prop({ required: true, type: String }) private type!: string;

    private url: string = '';

    private created() {
        this.calcUrl();
    }

    @Watch('type')
    private async calcUrl() {
        this.url = await getHexColoredMarkerURL(this.type, this.color);
    }

    private get color(): string {
        const style = getComputedStyle(document.documentElement).getPropertyValue('--text');

        let rgb: [number, number, number];
        if (style.length === 0) {
            rgb = [45, 45, 45];
        } else {
            rgb = style.split(/\s*,\s*/i).map(s => Number.parseInt(s, 10)) as [number, number, number];
        }

        return rgbToHex(rgb);
    }
}
</script>
