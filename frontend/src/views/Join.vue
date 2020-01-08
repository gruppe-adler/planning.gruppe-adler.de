<template>
    <div class="grad-join">
        <h1 style="margin: 0.75em;">Join Session</h1>
        <input type="text" v-model="nick" placeholder="Nickname" />
        <div style="display: flex; align-items: center; margin: 1rem 0px;">
            <label style="margin-right: 1rem;">Color:</label>
            <div class="grad-join__color" :style="`color: ${color}`" @click.self="pickerShown=true">
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
        </div>
        <div>
            <input type="checkbox" v-model="remember" />
            <label>Remember this</label>
        </div>
        <button @click="join" :disabled="nick.length === 0">Join</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { createSession } from '@/services';
import { Map, fetchMaps } from '@/services/maps';

// @ts-ignore
import ColorPickerVue from '@caohenghu/vue-colorpicker';

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

        this.color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    }

    private join() {
        const values = { color: this.color, nick: this.nick };

        if (this.remember) {
            localStorage.setItem('grad-planning-user', JSON.stringify(values));
        } else {
            localStorage.removeItem('grad-planning-user');
        }

        this.$store.commit('setUser', {
            ...values,
            remember: this.remember
        });

        this.$router.push(`/session/${this.id}`);
    }
}
</script>

<style lang="scss" scoped>
.grad-join {
    width: 100vw;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    > * {
        width: 61rem;
        max-width: calc(100% - 2rem);
    }

    &__color {
        height: 3.75rem;
        width: 3.75rem;
        flex-shrink: 0;
        position: relative;
        display: inline-flex;
        border-radius: 50%;
        background-color: currentColor;
        cursor: pointer;
        user-select: none;
    }

    &__color-picker {
        position: absolute;
        top: 0;
        left: calc(70%);

        &-mask {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
        }
    }
}
</style>
