<template>
<div :class="['grad-select', expanded ? 'grad-select--expanded' : '']" @click="expanded = true;">
        <template v-if="value !== null">
            <div v-if="$scopedSlots.item" style="width: 100%; height: 100%; display: flex; align-items: center;">
                <slot name="item" :item="value"></slot>
            </div>
            <span v-else>{{value[nameField]}}</span>
        </template>
        <span v-else></span>
    <i class="material-icons" v-if="expanded">arrow_drop_up</i>
    <i class="material-icons" v-else>arrow_drop_down</i>
    <div class="grad-select__items" @click.stop="null;" v-if="expanded" ref="list">
        <div
            v-for="(item, index) in items"
            :key="index"
            @click="$emit('input', item); expanded = false;"
        >
            <slot name="item" :item="item">
                <span>{{item[nameField]}}</span>
            </slot>
        </div>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

type ClickCallback = (this: Window, ev: MouseEvent) => any;

@Component
export default class SelectVue extends Vue {
    @Prop({ default: null }) private value!: unknown|null;
    @Prop({ default: 'name' }) private nameField!: string;
    @Prop({ default: [] }) private items!: unknown[];

    private expanded: boolean = false;

    private handler: null|ClickCallback = null;

    @Watch('expanded')
    private addEH() {
        if (this.expanded) {
            this.handler = (event: MouseEvent) => this.onClick(event);
            window.setTimeout(
                () => window.addEventListener('click', this.handler!, { once: true, capture: true }),
                50
            );
        } else if (!this.expanded && this.handler) {
            window.removeEventListener('click', this.handler);
            this.handler = null;
        }
    }

    private onClick(event: MouseEvent) {
        if (!this.$refs.list || !event.target) return;
        const target = event.target as HTMLElement;
        const list = this.$refs.list as HTMLDivElement;

        if (target === list || list.contains(target)) return;

        event.preventDefault();
        event.stopPropagation();
        this.expanded = false;
        this.handler = null;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-select {
    color: $color-active;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: .5rem;
    align-items: center;
    border-bottom: 1px solid $color-inactive;
    height: 2.5rem;
    font-size: 1rem;
    position: relative;
    cursor: pointer;
    user-select: none;

    &--expanded {
        border-color: $color-active;
    }

    &__items {
        position: absolute;
        top: calc(100% + 1px);
        left: 0px;
        right: 0px;
        background-color: $color-background;
        border-bottom-left-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        z-index: 100;
        height: 200px;
        overflow-y: scroll;
        box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.6), 0px 8px 10px 1px rgba(0, 0, 0, 0.42), 0px 3px 14px 2px rgba(0, 0, 0, 0.36);

        > * {
            height: 2.5rem;
            padding-left: 1rem;
            display: flex;
            align-items: center;
            color: darken($color-active, 40%);
            cursor: pointer;

            &:hover {
                color: $color-active;
            }
        }
    }
}
</style>
