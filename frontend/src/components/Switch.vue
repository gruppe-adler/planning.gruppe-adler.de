<template>
    <div :class="['grad-switch', checked ? 'grad-switch--checked' : '', disabled ? 'grad-switch--disabled' : '']" @click="checked = !checked">
        <div class="grad-switch__track"></div>
        <div class="grad-switch__thumb"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SwitchVue extends Vue {
    @Prop({ default: false, type: Boolean }) private value!: boolean;
    @Prop({ default: false, type: Boolean }) private disabled!: boolean;

    private get checked() { return this.value; };
    private set checked(v: boolean) { this.$emit('input', v); };
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-switch {
    position: relative;
    height: 1.5rem;
    width: 3rem;
    cursor: pointer;
    color: $color-active;

    & , > * {
        transition: all 0.1s ease-in-out;
    }

    &__track {
        position: absolute;
        top: .25rem;
        left: .25rem;
        right: .25rem;
        bottom: .25rem;
        color: inherit;
        background-color: currentColor;
        opacity: 0.5;
        border-radius: .5rem;
    }

    &__thumb {
        position: absolute;
        color: inherit;
        background-color: currentColor;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 50%;
        left: 0;
    }

    &#{&}--checked {
        color: $color-primary;
    }

    &--checked #{&}__thumb {
        left: 100%;
        transform: translateX(-100%)
    }

    &#{&}--disabled {
        color: $color-inactive;
        pointer-events: none;
    }
}
</style>
