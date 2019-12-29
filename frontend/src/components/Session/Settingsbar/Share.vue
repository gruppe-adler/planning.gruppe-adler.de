<template>
    <SettingsbarPanel
        id="share"
        icon="share"
        tooltip="Share"
        :value="value"
        @input="$emit('input', $event)"
    >
        <div @click="copy">
            <input type="text" v-model="link" readonly ref="input" />
            <i class="material-icons">content_copy</i>
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
export default class ShareVue extends Vue {
    @Prop({ default: '' }) private value!: string;

    private get link() {
        return `${location.origin}/join/${this.$store.state.sessionId}`;
    }

    private copy() {
        (this.$refs.input as HTMLInputElement).select();
        document.execCommand('copy');
    }
}
</script>

<style lang="scss" scoped>
div {
    position: relative;
    display: flex;
    align-items: center;

    >input {
        font-size: 12px;
        min-width: 300px;
        padding-right: 3.7em;

        &:active, &:focus {
            background-color: #D6D4D3 !important;
        }
    }

    > i {
        cursor: pointer;
        font-size: 1.5em;
        right: 0px;
        padding: calc((1.877em - 1em) / 2);
        position: absolute;
        color: rgba(black, 0.5);
        user-select: none;
    }
}
</style>
