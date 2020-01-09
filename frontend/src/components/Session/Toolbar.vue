<template>
<div class="grad-toolbar grad-group">
    <grad-icon-btn
        v-for="t in tools"
        :key="t.id"
        :tooltip="t.displayName"
        :icon="t.icon"
        :active="t.id === tool"
        @click="tool = t.id"
    />
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
            id: 'pointing',
            displayName: 'Pointing',
            icon: 'touch_app'
        },
        {
            id: 'line',
            displayName: 'Line',
            icon: 'timeline'
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
