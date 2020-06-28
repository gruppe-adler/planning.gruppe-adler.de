<template>
    <div :class="classes" v-on="$listeners" v-bind="$attrs">
        <slot
            name="icon"
            :icon="icon"
        >
            <i class="material-icons">{{icon}}</i>
        </slot>
        <span><slot /></span>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ButtonVue extends Vue {
    @Prop({ default: 'close', type: String }) private icon!: string;
    @Prop({ default: false, type: Boolean }) private active!: boolean;
    @Prop({ default: false, type: Boolean }) private disabled!: boolean;

    private get classes(): string {
        const classes = [
            'grad-button',
            this.active ? 'grad-button--active' : '',
            this.disabled ? 'grad-button--disabled' : ''
        ];

        return classes.filter(str => str.length > 0).join(' ');
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    color: rgb($color-inactive);
    position: relative;
    width: auto;
    box-sizing: content-box;

    &:not(:last-child)::before {
        content: '';
        position: absolute;
        height: 1px;
        right: .5rem;
        left: .5rem;
        bottom: 0;
        background-color: rgb($color-divider);
    }

    > i {
        color: inherit;
        user-select: none;
        padding: 0.75rem;
        flex-shrink: 0;
    }

    > span {
        white-space: nowrap;
        flex-shrink: 0;
        margin-right: 1rem;
    }

    &:hover {
        background-color: rgba($color-active, 0.05);
    }

    &--disabled {
        cursor: default;

        > i, > span {
            opacity: 0.4;
        }

        &:hover {
            background-color: transparent;
        }
    }

    &--active {
        color: rgb($color-active);
    }
}
</style>
