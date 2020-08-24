<template>
    <div class="grad-home">
        <div class="grad-home__wrapper">
            <img src="@/assets/logo.svg" />
            <div v-if="joinShown" class="grad-home__join">
                <input type="text" v-model="token" autofocus />
                <label>Session-Code</label>
                <button @click="joinShown = false;">
                    <i class="material-icons">arrow_back</i>
                </button>
                <router-link :to="`/join/${token}`" tag="button" :disabled="token.length === 0">
                    <i class="material-icons">check</i>
                </router-link>
            </div>
            <template v-else>
                <router-link tag="button" to="/create">Create</router-link>
                <button @click="joinShown = true;">Join</button>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HomeVue extends Vue {
    private token: string = '';
    private joinShown: boolean = false;
};
</script>

<style lang="scss" scoped>
  @import '~@/colors.scss';
.grad-home {
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;

    input[type=text], button {
        color: rgb($color-primary);
        background-color: rgb($color-divider);
        border-radius: 1.35em;
        padding: 0.75em 1em;
        border: none;
        font-weight: 600;
        outline: none;
        height: 1.2em;
        box-sizing: content-box;
        font-size: inherit;
    }

    button {
        user-select: none;
        transition: all 0.1s ease-in-out;
        cursor: pointer;

        &:hover {
            background-color: rgb($color-primary);
            color: white;
        }

        &[disabled] {
            color: rgb($color-inactive);
            background-color: rgba($color-background, 0.5);
            pointer-events: none;
        }
    }

    input[type=text] {
        padding-top: 1.25em;
        padding-bottom: 0.25em;
        color: rgb($color-text);
    }

    &__wrapper {
        display: inline-grid;
        grid-column-gap: 2px;
        grid-row-gap: 1rem;
        grid-template:
            "logo logo" auto
            "btn btn" auto / .5fr .5fr;

        width: 30rem;
        max-width: calc(100vw - 2rem);
        margin-bottom: 10%;

        > img {
            max-width: 100%;
            height: 25rem;
            grid-area: logo;
            justify-self: center;
        }

        > button {
            &:first-of-type {
                border-top-right-radius: 0px;
                border-bottom-right-radius: 0px;
            }

            &:last-of-type {
                border-top-left-radius: 0px;
                border-bottom-left-radius: 0px;
            }
        }
    }

    &__join {
        grid-area: btn;
        justify-self: stretch;
        align-self: stretch;
        position: relative;
        display: flex;

        input[type=text] {
            width: 100%;
            text-align: center;
        }

        label {
            position: absolute;
            top: 0.25rem;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: lighter;
            pointer-events: none;
            opacity: 0.75;
        }

        > button {
            top: .25rem;
            bottom: .25rem;
            position: absolute;
            padding: 0;
            border-radius: 50%;
            height: calc(2.7em - 0.5rem);
            width: calc(2.7em - 0.5rem);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0.75;

            &:first-of-type {
                left: .25rem;
                color: rgb($color-text);
                background-color: rgb($color-background);
            }

            &:last-of-type {
                right: .25rem;
                color: white;
                background-color: rgb($color-primary);

                &:disabled {
                    background-color: rgba(black, 0.2);
                }
            }

            &:hover {
                opacity: 1;
            }
        }
    }

}
</style>
