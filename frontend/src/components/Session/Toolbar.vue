<template>
<div class="grad-toolbar grad-group">
    <div
        v-for="t in tools"
        :key="t.id"
        :class="['grad-toolbar__tool', t.id === tool ? 'grad-toolbar--active' : '']"
        @click="tool = t.id"
    >
        <i class="material-icons">{{t.icon}}</i>
        <span class="grad-toolbar__tool-tooltip">{{t.displayName}}</span>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

interface Tool {
    id: string;
    displayName: string;
    icon: string;
}

@Component
export default class ToolbarVue extends Vue {
    @Prop({ default: '' }) private value!: string;

    private tools: Tool[] = [
        {
            id: 'pan',
            displayName: 'Pan',
            icon: 'pan_tool'
        },
        {
            id: 'point',
            displayName: 'Pointing',
            icon: 'touch_app'
        },
        {
            id: 'marker',
            displayName: 'Marker',
            icon: 'location_on'
        },
        {
            id: 'line',
            displayName: 'Line',
            icon: 'timeline'
        },
        {
            id: 'comment',
            displayName: 'Comment',
            icon: 'mode_comment'
        },
        {
            id: 'image',
            displayName: 'Image',
            icon: 'photo'
        }
    ];

    // helper functions for v-model
    // just use this.tool to access it
    private get tool() { return this.value; }
    private set tool(val: string) { this.$emit('input', val); }
}
</script>

<style lang="scss" scoped>
.grad-toolbar {
    display: flex;
    position: fixed;
    top: 1rem;
    left: 1rem;

    &__tool {
        padding: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.1s ease-in-out;

        &:not(:last-child)::before {
            content: '';
            position: absolute;
            width: 1px;
            right: 0px;
            bottom: .5rem;
            top: .5rem;
            background-color: #D5D5D5;
        }

        &-tooltip {
            display: none;
            color: white;
            white-space: nowrap;
            background-color: rgba(black, 0.6);
            padding: 8px;
            border-radius: 4px;
            position: absolute;
            font-size: 14px;
            font-weight: bold;
            top: calc(100% + 4px);
            letter-spacing: 0.08em;
            z-index: 2;
            pointer-events: none;
            user-select: none;
        }

        &:hover {
            background-color: rgba(black, 0.05);

            > .grad-toolbar__tool-tooltip {
                display: initial;
            }
        }

        > i {
            color: inherit;
            user-select: none;
        }

        &.grad-toolbar--active {
            color: #66AA66;
        }
    }
}
</style>
