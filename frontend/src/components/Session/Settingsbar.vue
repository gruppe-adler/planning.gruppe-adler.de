<template>
<div class="grad-settigs-bar grad-group">
    <grad-icon-btn
        icon="settings"
        tooltip="Settings"
        :disabled="true"
    />
    <Share v-model="extended" />
    <Export v-model="extended" />
    <Import v-model="extended" />
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import ShareVue from './Settingsbar/Share.vue';
import ExportVue from './Settingsbar/Export.vue';
import ImportVue from './Settingsbar/Import.vue';

@Component({
    components: {
        Share: ShareVue,
        Export: ExportVue,
        Import: ImportVue
    }
})
export default class SettingbarVue extends Vue {
    private extended: string = 'none';
}
</script>

<style lang="scss" scoped>
.grad-settigs-bar {
    display: flex;
    position: fixed;
    top: 1rem;
    right: 1rem;
}
</style>
