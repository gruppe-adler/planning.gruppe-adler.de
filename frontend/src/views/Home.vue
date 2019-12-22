<template>
    <div class="grad-home">
        <div>
            <input type="text" v-model="token" placeholder="Session Beitreten" />
            <p v-if="token.length === 0">oder</p>
            <router-link
                v-if="token.length === 0"
                to="/create"
                tag="button"
            >
                Session erstellen
            </router-link>
            <router-link
                v-else
                :to="`/join/${token}`"
                tag="button"
                :disabled="token.length === 0"
            >
                Beitreten
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HomeVue extends Vue {
    private token: string = '';
};
</script>

<style lang="scss" scoped>
.grad-home {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    > div {
        width: 500px;
        max-width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        > *:not(:last-child) {
            margin-bottom: 1rem;
        }
    }

}
</style>
