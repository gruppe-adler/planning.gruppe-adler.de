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
        border: none;
        font-weight: 600;
        outline: none;
        box-sizing: content-box;
        font-size: inherit;
        text-align: center;
        background-color: rgb($color-divider);
        color: rgb($color-primary);
        border-radius: 1.35em;
        height: 1.2em;
        padding: 0.75em 1em;
        margin-top: 1rem;
        user-select: none;
        transition: all 0.1s ease-in-out;
        cursor: pointer;
        min-width: 10rem;

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
