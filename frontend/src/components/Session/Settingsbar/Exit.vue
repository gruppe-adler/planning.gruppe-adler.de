<template>
    <SettingsbarPanel
        id="exit"
        icon="exit_to_app"
        tooltip="Exit"
        :value="value"
        :noPadding="true"
        @input="$emit('input', $event)"
    >
        <div class="grad-exit">
            <div style="font-size: 1.2em; margin: 0 auto 0 .75rem;">Exit Session?</div>
            <grad-icon-btn
                @click="$emit('input', 'none')"
                icon="close"
                tooltip="Cancel"
            />
            <grad-icon-btn
                @click="$router.push('/')"
                icon="done"
                tooltip="Exit Session"
            />
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
export default class ExitVue extends Vue {
    @Prop({ default: '' }) private value!: string;
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-exit {
    width: 100%;
    justify-content: flex-end;
    align-items: center;
    display: flex;
}
</style>
