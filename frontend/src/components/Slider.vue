<template>
    <div :class="['grad-slider', active ? 'grad-slider--active' : '']" @mousedown="onMouseDown">
        <div :key="percent" class="grad-slider__thumb" :style="`width: ${percent}%`"></div>
        <span class="grad-slider__text">
            <slot>
                {{ value.toFixed(2) }}
            </slot>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SliderVue extends Vue {
    @Prop({ default: 0 }) private value!: number;
    @Prop({ default: 100 }) private max!: number;
    @Prop({ default: 0 }) private min!: number;
    @Prop({ default: 1 }) private steps!: number;

    private active: boolean = false;

    private onMouseDown(event: MouseEvent) {
        const mouseMoveEH = (ev: MouseEvent) => this.updateAccToMousePos(ev);
        this.active = true;

        window.addEventListener('mousemove', mouseMoveEH);

        window.addEventListener(
            'mouseup',
            (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                this.active = false;
                window.removeEventListener('mousemove', mouseMoveEH);
            },
            { once: true, capture: true }
        );

        this.updateAccToMousePos(event);
    }

    private updateAccToMousePos(event: MouseEvent) {
        if (!this.$el) return;

        const slider = this.$el as HTMLDivElement;

        const { left, width } = slider.getBoundingClientRect();
        const x = event.pageX;

        const percent = (x - left) / width;

        let val = this.min + (this.max - this.min) * percent;

        const remainder = val % this.steps;
        val = val - remainder;
        val = Math.max(val, this.min);
        val = Math.min(val, this.max);

        this.$emit('input', val);
    }

    private get percent(): number {
        return (this.value - this.min) / (this.max - this.min) * 100;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-slider {
    overflow: hidden;
    border-radius: .5rem;
    height: 1.75rem;
    width: 100%;
    background-color: $color-divider;
    position: relative;
    // transition: all 0.05s ease-in-out;

    &__thumb {
        background-color: $color-inactive;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        transition: all 0.05s ease-in-out;
    }

    &__text {
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        color: $color-active;
        font-size: 1rem;
    }

    &--active #{&}__thumb {
        background-color: $color-active;
    }

    &--active #{&}__text {
        color: $color-inactive;
    }
}
</style>
