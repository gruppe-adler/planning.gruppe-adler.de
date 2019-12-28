<template>
<div class="grad-popup">
    <div
        class="grad-icon-button grad-icon-button--tooltip-top grad-icon-button--dense"
        @click="$emit('edit')"
    >
        <i class="material-icons">edit</i>
        <span class="grad-icon-button__tooltip">Edit</span>
    </div>
    <div
        class="grad-icon-button grad-icon-button--tooltip-top grad-icon-button--dense"
        @click="$emit('delete')"
    >
        <i class="material-icons">delete</i>
        <span class="grad-icon-button__tooltip">Delete</span>
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
}
</style>
