<template>
    <div class="grad-colors">
        <div
            v-for="c in colors"
            :key="c.id"
            :style="`color: rgba(${c.color[0] * 255}, ${c.color[1] * 255}, ${c.color[2] * 255}, ${c.color[3]});`"
            :class="['grad-colors__color', value && c.id === value ? 'grad-colors__color--active' : '']"
            @click="$emit('input', c.id)"
            :data-id="c.id"
        ></div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Marker } from '@/services/shared';
import { rgbToCssFilter } from '@/utils/color';

interface ArmaMarkerColor {
    color: [number, number, number, number];
    id: string;
    name: string;
}

const markerColors: ArmaMarkerColor[] = require('@/assets/marker-colors.json');

@Component
export default class ColorsVue extends Vue {
    @Prop({ default: 'GRAD_DEFAULT_COLOR' }) private value!: string;
    @Prop({ default: () => [0, 0, 0, 1] }) private default!: [number, number, number, number];

    private get colors(): ArmaMarkerColor[] {
        return [
            {
                color: this.default,
                id: 'GRAD_DEFAULT_COLOR',
                name: 'Default'
            },
            ...markerColors
        ];
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';
.grad-colors {

    display: flex;
    align-items: center;
    flex-wrap: wrap;

    &__color {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 50%;
        background-color: currentColor;
        cursor: pointer;
        margin: .4rem;
        flex-shrink: 0;
        position: relative;

        &--active::before {
            content: "";
            position: absolute;
            top: -.25rem;
            bottom: -.25rem;
            left: -.25rem;
            right: -.25rem;
            border: currentColor .125rem solid;
            border-radius: 50%;
            opacity: .7;
            color: inherit;
        }
    }

}
</style>
