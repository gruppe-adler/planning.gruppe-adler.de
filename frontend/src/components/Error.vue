<template>
    <div class="grad-error">
        <h2>{{description}}</h2>
        <button
            v-if="button.length > 0"
            @click="$emit('button', $event)"
        >
            {{button}}
        </button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ErrorVue extends Vue {
    @Prop({ default: '', type: String }) private description!: string;
    @Prop({ default: '', type: String }) private button!: string;
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 4rem;

    > h2 {
        color: $color-text;
        text-transform: none;
        font-weight: normal;
    }

    > button {
        margin: 1rem;
    }
}
</style>
