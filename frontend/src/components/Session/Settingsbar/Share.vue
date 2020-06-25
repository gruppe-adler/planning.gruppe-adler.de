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
        return `${location.origin}/join/${this.$tstore.state.sessionId}`;
    }

    private copy() {
        (this.$refs.input as HTMLInputElement).select();
        document.execCommand('copy');
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

div {
    position: relative;
    display: flex;
    align-items: center;

    >input {
        font-size: 1rem;
        min-width: 300px;
        padding-right: 2.6rem;
        color: $color-active;
    }

    > i {
        cursor: pointer;
        font-size: 1.5em;
        right: 0px;
        padding: 0.5rem;
        position: absolute;
        color: $color-inactive;
        user-select: none;
        transition: all 0.1s ease-in-out;
        &:hover{
          color: $color-active;
        }
    }

    &:focus-within {
        > i {
            color: $color-active;
        }
    }

}
</style>
