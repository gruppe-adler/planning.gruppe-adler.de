<template>
    <SettingsbarPanel
        id="import"
        icon="upload_file"
        tooltip="Import"
        :value="value"
        @input="$emit('input', $event)"
    >
        <input
            ref="upload"
            style="display: none"
            type="file"
            multiple="false"
            accept="application/json"
            @input="onInput"
        />
        <div
            @click="onClick"
            @drop="onDrop"
            @dragover="$event.preventDefault()"
            :class="['grad-import', isDragging ? 'grad-import--active' : '']"
        >
            <span>Drop file here or click to upload</span>
        </div>
    </SettingsbarPanel>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
import Validator from 'validator';
import SettingsbarPanelVue from './SettingsbarPanel.vue';
import { Feature } from '@/services/shared';
import { validateFeature } from '@/utils/validate';

@Component({
    components: {
        SettingsbarPanel: SettingsbarPanelVue
    }
})
export default class ImportVue extends Vue {
    @Prop({ default: '' }) private value!: string;
    private isDragging: boolean = false;
    private dragTimeOut?: number;

    private file: File|null = null;

    private created() {
        document.body.addEventListener('dragover', this.onDrag);
    }

    private beforeDestroy() {
        document.body.removeEventListener('dragover', this.onDrag);
    }

    private onDrag() {
        this.isDragging = true;

        if (this.dragTimeOut) clearTimeout(this.dragTimeOut);

        this.dragTimeOut = window.setTimeout(() => {
            this.isDragging = false;
        }, 100);
    }

    private onInput() {
        const uploadInput = this.$refs.upload as HTMLInputElement;
        if (!uploadInput.files) return;

        let file: File|null = null;
        for (const f of uploadInput.files) {
            if (f.type === 'application/json') file = f;
        }

        this.file = file;
    }

    private onClick() {
        const uploadInput = this.$refs.upload as HTMLInputElement;
        const res = uploadInput.click();
    }

    private onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const uploadInput = this.$refs.upload as HTMLInputElement;

        if (!event.dataTransfer) return;

        uploadInput.files = event.dataTransfer.files;

        this.onInput();
    }

    @Watch('file')
    private async onFileChanged() {
        if (this.file === null) return;

        const json = await this.readFile(this.file);

        let parsed: unknown;
        try {
            parsed = JSON.parse(json);
        } catch (err) {
            console.log(err);
            // TODO: notify user
            return;
        }

        if (!Array.isArray(parsed)) {
            console.error('no array');
            // TODO: notify user
            return;
        }

        const arr: unknown[] = parsed;

        const features: Feature[] = [];

        for (const element of arr) {
            try {
                features.push(validateFeature(element));
            } catch (err) {
                console.error('Feature is no valid feature.');
            }
        }

        if (this.$tstore.state.featureService === null) return;

        for (const feature of features) {
            this.$tstore.state.featureService.createFeature(feature);
        }
    }

    private readFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsText(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
        });
    }
}
</script>

<style lang="scss" scoped>
@import '~@/colors.scss';

.grad-import {
    width: 12rem;
    height: 6rem;
    color: $color-inactive;
    border: 2px dashed currentColor;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;

    &--active, &:hover {
        color: $color-active;
    }
}
</style>
