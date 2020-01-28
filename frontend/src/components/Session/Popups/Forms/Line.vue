<template>
<div class="grad-line-form">
    <Colors v-model="value.color" :showDefault="false" />
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Line } from '@/services/shared';
import ColorsVue from './Marker/Colors.vue';
import { PropType } from 'vue';

@Component({
    components: {
        Colors: ColorsVue
    }
})
export default class LineFormVue extends Vue {
    @Prop({ required: true, type: Object as PropType<Line> }) private value!: Line;
}
</script>
