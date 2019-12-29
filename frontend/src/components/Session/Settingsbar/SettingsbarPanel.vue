<template>
    <div :class="['grad-icon-button', isExtended ? 'grad-icon-button--active' : '']" @click="extend">
        <i class="material-icons">{{icon}}</i>
        <span v-if="tooltip.length > 0" class="grad-icon-button__tooltip">{{tooltip}}</span>
        <div v-if="isExtended" class="grad-settings-bar-panel__dialog grad-group" @click.stop>
            <slot />
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SettingsbarPanelVue extends Vue {
    @Prop({ default: '' }) private value!: string;
    @Prop({ required: true }) private id!: string;
    @Prop({ default: '' }) private icon!: string;
    @Prop({ default: '' }) private tooltip!: string;

    // helper functions for v-model
    // just use this.map to access it
    private get extended() { return this.value; }
    private set extended(val: string) { this.$emit('input', val); }

    private extend() {
        if (this.extended === this.id) {
            this.extended = 'none';
        } else {
            this.extended = this.id;
        }
    }

    private get isExtended() {
        return this.extended === this.id;
    }
}
</script>

<style lang="scss" scoped>
.grad-settings-bar-panel__dialog {
    position: absolute;
    padding: 0.75rem;
    top: calc(100% + 4px);
    right: 0px;
    cursor: default;
    min-width: 250px;
}
</style>
