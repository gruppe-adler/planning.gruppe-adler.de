<template>
<div class="grad-toolbar grad-group">
    <div
        v-for="t in tools"
        :key="t.id"
        :class="['grad-icon-button', t.id === tool ? 'grad-icon-button--active' : '', t.disabled ? 'grad-icon-button--disabled' : '']"
        @click="tool = t.id"
    >
        <i class="material-icons">{{t.icon}}</i>
        <span class="grad-icon-button__tooltip">{{t.displayName}}</span>
    </div>
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

interface Tool {
    id: string;
    displayName: string;
    icon: string;
    disabled?: boolean;
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
            icon: 'touch_app',
            disabled: true
        },
        {
            id: 'marker',
            displayName: 'Marker',
            icon: 'location_on',
            disabled: true
        },
        {
            id: 'line',
            displayName: 'Line',
            icon: 'timeline'
        },
        {
            id: 'comment',
            displayName: 'Comment',
            icon: 'mode_comment',
            disabled: true
        },
        {
            id: 'image',
            displayName: 'Image',
            icon: 'photo',
            disabled: true
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
}
</style>
