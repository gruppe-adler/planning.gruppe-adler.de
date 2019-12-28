<template>
<div class="grad-popup">
    <div
        v-for="t in tools"
        :key="t.id"
        :class="['grad-icon-button grad-icon-button--tooltip-top grad-icon-button--dense', t.disabled ? 'grad-icon-button--disabled' : '']"
        @click="$emit(t.id)"
    >
        <i class="material-icons">{{t.icon}}</i>
        <span class="grad-icon-button__tooltip">{{t.displayName}}</span>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Popup } from 'leaflet';

interface Tool {
    id: string;
    displayName: string;
    icon: string;
    disabled?: boolean;
}

@Component
export default class PopupVue extends Vue {
    private tools: Tool[] = [
        {
            id: 'edit',
            displayName: 'Edit',
            icon: 'edit',
            disabled: true
        },
        {
            id: 'delete',
            displayName: 'Delete',
            icon: 'delete'
        }
    ];

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
