<template>
<div class="grad-image-form">
    <input type="text" placeholder="URL" v-model="value.url" style="width: 100%" />
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Picture } from '@/services/shared';
import { rgbToCssFilter } from '@/utils/color';
import { PropType } from 'vue';

@Component
export default class PictureFormVue extends Vue {
    @Prop({ required: true, type: Object as PropType<Picture> }) private value!: Picture;
}
</script>
