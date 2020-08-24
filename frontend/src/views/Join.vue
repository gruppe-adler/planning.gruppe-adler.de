<template>
    <div class="grad-join">
        <router-link class="grad-join__back" tag="div" to="/">
            <i class="material-icons">arrow_back</i>
        </router-link>
        <h1 style="justify-self: center;">
            Join Session
        </h1>
        <div class="grad-join__form">
            <div class="grad-join__nickname">
                <input type="text" v-model="nick" autofocus="true" />
                <label>Nickname</label>
            </div>
            <div class="grad-join__color" :style="`color: ${color}`" @click.self="pickerShown=true">
                <label>Color</label>
                <div class="grad-join__color-picker-mask" v-if="pickerShown" @click="pickerShown=false"></div>
                <ColorPicker
                    @click.stop="true;"
                    v-if="pickerShown"
                    class="grad-join__color-picker"
                    theme="dark"
                    :color="color"
                    :sucker-hide="true"
                    @changeColor="changeColor"
                />
            </div>
            <div style="display: grid; align-items: center; justify-content: center; grid-template-columns: auto auto; grid-column-gap: .5rem;">
                <grad-switch v-model="remember" />
                <label>Remember me</label>
            </div>
            <button class="grad-join__button" :disabled="nick.length === 0" @click="join">Join</button>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { createSession } from '@/services';

// @ts-ignore
import ColorPickerVue from '@caohenghu/vue-colorpicker';
import { rgbToHex } from '../utils/color';

@Component({
    components: {
        ColorPicker: ColorPickerVue
    }
})
export default class JoinVue extends Vue {
    @Prop({ default: '' }) private id!: string;

    private nick: string = '';
    private color: string = '#d18d1f';
    private remember: boolean = false;
    private pickerShown: boolean = false;

    private created() {
        if (this.id === '') this.$router.push('/');

        const item = localStorage.getItem('grad-planning-user');
        if (!item) return;

        const { color, nick } = JSON.parse(item);
        this.color = color;
        this.nick = nick;
        this.remember = true;

        this.join();
    }

    private changeColor(color: { rgba: { r: number, g: number, b: number }}) {
        const { r, g, b } = color.rgba;

        this.color = rgbToHex([r, g, b]);
    }

    private join() {
        const values = { color: this.color, nick: this.nick };

        if (this.remember) {
            localStorage.setItem('grad-planning-user', JSON.stringify(values));
        } else {
            localStorage.removeItem('grad-planning-user');
        }

        this.$tstore.commit('setUser', {
            ...values,
            remember: this.remember
        });

        this.$router.push(`/session/${this.id}`);
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';
.grad-join {
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template:
        "back heading" auto
        "form form" 1fr / auto 1fr;
    height: 100vh;
    overflow: hidden;
    align-items: center;

    &__back {
        grid-area: back;
        cursor: pointer;
        font-size: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem;
        width: 3em;

        > i {
            opacity: 0.5;
            font-size: 1.5em;
            transition: opacity 0.1s ease-in-out;
        }

        &:hover > i {
            opacity: 1;
        }
    }

    &__form {
        grid-area: form;
        justify-self: center;
        display: grid;
        grid-row-gap: 1rem;
        font-size: 1.25rem;

        input, button {
            border: none;
            font-weight: 600;
            outline: none;
            box-sizing: content-box;
            font-size: inherit;
            text-align: center;
            background-color: rgb($color-divider);
            border-radius: 1.35em;
            height: 1.2em;
        }
    }

    &__nickname {
        position: relative;
        > input {
            color: rgb($color-text);
            padding: 1.25em 1em 0.25em 1em;
        }

        > label {
            position: absolute;
            top: 0.25rem;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: lighter;
            pointer-events: none;
            opacity: 0.75;
        }
    }

    &__color {
        border-radius: 1.35em;
        padding: 0.75em 1em;
        height: 1.2em;
        font-size: inherit;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: currentColor;
        cursor: pointer;
        user-select: none;
        &-picker {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);

            &-mask {
                position: fixed;
                top: 0px;
                left: 0px;
                width: 100vw;
                height: 100vh;
            }
        }
    }

    &__button {
        color: rgb($color-primary);
        padding: 0.75em 1em;
        margin-top: 1rem;

        user-select: none;
        transition: all 0.1s ease-in-out;
        cursor: pointer;

        &:hover {
            background-color: rgb($color-primary);
            color: white;
        }

        &[disabled] {
            color: rgb($color-inactive);
            background-color: rgba($color-divider, 0.5);
            pointer-events: none;
        }
    }
}

</style>
