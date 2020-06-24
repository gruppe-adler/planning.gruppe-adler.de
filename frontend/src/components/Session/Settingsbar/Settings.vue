<template>
    <SettingsbarPanel
        id="settings"
        icon="settings"
        tooltip="Settings"
        :value="value"
        @input="$emit('input', $event)"
    >
        <div class="grad-settings__switch-grid">
            <span>Show Satellite Image</span>
            <grad-switch :value="isSatShown" @input="toggleSat" />

            <span>Show Grid</span>
            <grad-switch :value="isGridShown" @input="toggleGrid" :disabled="true" />
        </div>
    </SettingsbarPanel>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import SettingsbarPanelVue from './SettingsbarPanel.vue';

@Component({
    components: {
        SettingsbarPanel: SettingsbarPanelVue
    }
})
export default class SettingsVue extends Vue {
    @Prop({ default: '' }) private value!: string;

    private get isSatShown(): boolean {
        return (this.$tstore.state.map !== null && this.$tstore.state.map.satShown);
    }

    private toggleSat() {
        if (this.$tstore.state.map === null) return;

        this.$tstore.state.map.satShown = !this.$tstore.state.map.satShown;
    }

    private get isGridShown(): boolean {
        return false;
        // return (this.$tstore.state.map !== null && this.$tstore.state.map.gridShown);
    }

    private toggleGrid() {
        if (this.$tstore.state.map === null) return;

        this.$tstore.state.map.gridShown = !this.$tstore.state.map.gridShown;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-settings__switch-grid {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-row-gap: .75rem;
}
</style>
