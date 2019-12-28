<template>
<div class="grad-settigs-bar grad-group">
    <div class="grad-icon-button grad-icon-button--disabled">
        <i class="material-icons">settings</i>
        <span class="grad-icon-button__tooltip">Settings</span>
    </div>
    <Share :id="id" />
    <div class="grad-icon-button grad-icon-button--disabled">
        <i class="material-icons">save</i>
        <span class="grad-icon-button__tooltip">Export</span>
    </div>
    <div class="grad-icon-button grad-icon-button--disabled">
        <i class="material-icons">import_export</i>
        <span class="grad-icon-button__tooltip">Import</span>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import ShareVue from './Settingsbar/Share.vue';

@Component({
    components: {
        Share: ShareVue
    }
})
export default class SettingbarVue extends Vue {
    @Prop({ default: -1 }) private id!: number;
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
