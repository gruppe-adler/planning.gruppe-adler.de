<template>
    <SettingsbarPanel
        id="export"
        icon="save_alt"
        tooltip="Export"
        :value="value"
        @input="$emit('input', $event)"
    >
        <button @click="download('json', jsonData);">Export as Session-JSON</button>
        <button disabled>Export as grad-saveMarkers</button>
        <button disabled>Export as SQF</button>
    </SettingsbarPanel>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { mapState } from 'vuex';
import { Feature } from '@/services/shared';
import SettingsbarPanelVue from './SettingsbarPanel.vue';

@Component({
    components: {
        SettingsbarPanel: SettingsbarPanelVue
    },
    computed: {
        ...mapState({
            features: (state: any) => state.features
        })
    }
})
export default class ExportVue extends Vue {
    @Prop({ default: '' }) private value!: string;

    private features!: Feature[];

    private download(extension: string, data: string) {
        const filename = this.fileName(extension);
        const elem = document.createElement('a');
        elem.style.display = 'none';
        elem.setAttribute('href', `data:text/plain;charset=utf-8, ${encodeURIComponent(data)}`);
        elem.setAttribute('download', filename);
        document.body.appendChild(elem);

        elem.click();

        document.body.removeChild(elem);
    }

    private fileName(extension: string) {
        const iso = (new Date()).toISOString();
        const dateStr = iso.substr(0, 10);
        const timeStr = iso.substr(11, 5);

        const id: string = this.$tstore.state.sessionId!;

        return `planning-session ${id} (${dateStr} ${timeStr}).${extension}`;
    }

    private get jsonData(): string {
        const featuresCopy: Array<Omit<Feature, 'id'>> = this.features.filter((f: Feature) => {
            return ['comment', 'line', 'marker', 'picture'].includes(f.type);
        }).map((f: Feature) => {
            delete f.id;
            return f;
        });

        return JSON.stringify(featuresCopy, undefined, 4);
    }
}
</script>

<style lang="scss" scoped>
button {
    width: 100%;

    &:not(:last-child) {
        margin-bottom: .5rem;
    }
}
</style>
