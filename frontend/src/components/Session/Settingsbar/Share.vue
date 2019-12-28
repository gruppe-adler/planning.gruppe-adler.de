<template>
    <div :class="['grad-icon-button', extended ? 'grad-icon-button--active' : '']" @click="extended = !extended">
        <i class="material-icons">share</i>
        <span class="grad-icon-button__tooltip">Share</span>
        <div v-if="extended" class="grad-share__dialog grad-group" @click.stop>
            <div @click="copy">
                <input type="text" v-model="link" readonly ref="input" />
                <i class="material-icons">content_copy</i>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ShareVue extends Vue {
    @Prop({ default: -1 }) private id!: number;

    private extended: boolean = false;

    private get link() {
        return `${location.origin}/join/${this.id}`;
    }

    private copy() {
        (this.$refs.input as HTMLInputElement).select();
        document.execCommand('copy');
    }
}
</script>

<style lang="scss" scoped>
.grad-share__dialog {
    position: absolute;
    padding: 0.75rem;
    top: calc(100% + 4px);
    right: 0px;
    cursor: default;

    > div {
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

}
</style>
