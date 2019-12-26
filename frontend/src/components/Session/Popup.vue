<template>
<div class="grad-popup grad-group">
    <svg class="grad-popup__triangle" viewBox="0 0 4 8">
        <polygon points="0,4 4,0 4,8" style="fill:white; box-shadow: 0px 0.25rem .5rem rgba(0, 0, 0, 0.125);" />
    </svg>
    <div
        class="grad-popup__tool"
        @click="$emit('edit')"
    >
        <i class="material-icons">edit</i>
        <span class="grad-popup__tool-tooltip">Edit</span>
    </div>
    <div
        class="grad-popup__tool"
        @click="$emit('delete')"
    >
        <i class="material-icons">delete</i>
        <span class="grad-popup__tool-tooltip">Delete</span>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class PopupVue extends Vue {}
</script>

<style lang="scss" scoped>
.grad-popup {
    display: flex;
    position: fixed;
    top: 50vh;
    left: 50vw;
    z-index: 1000;
    align-items: center;

    &__triangle {
        height: 60%;
        position: absolute;
        transform: translateX(-100%);
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
            top: calc(100% + 4px);
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
