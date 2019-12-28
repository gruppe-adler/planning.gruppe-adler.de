<template>
<div class="grad-popup">
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
import { Popup } from 'leaflet';

@Component
export default class PopupVue extends Vue {
    private mounted() {
        const popup = new Popup({
            closeButton: false,
            className: 'grad-popup__wrapper'
        });

        popup.setContent(this.$el as HTMLDivElement);

        this.$emit('popup-loaded', popup);
    }
}
</script>

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
