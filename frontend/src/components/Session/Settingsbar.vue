<template>
<div class="grad-settigs-bar grad-group">
    <div class="grad-icon-button grad-icon-button--disabled">
        <i class="material-icons">settings</i>
        <span class="grad-icon-button__tooltip">Settings</span>
    </div>
    <Share v-model="extended" />
    <Export v-model="extended" />
    <div class="grad-icon-button grad-icon-button--disabled">
        <i class="material-icons">upload_file</i>
        <span class="grad-icon-button__tooltip">Import</span>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import ShareVue from './Settingsbar/Share.vue';
import ExportVue from './Settingsbar/Export.vue';

@Component({
    components: {
        Share: ShareVue,
        Export: ExportVue
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
