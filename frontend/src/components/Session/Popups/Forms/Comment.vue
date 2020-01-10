<template>
<div class="grad-comment-form">
    <input type="text" placeholder="Description" v-model="value.text" style="width: 100%" />
</div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Comment } from '@/services/shared';
import { PropType } from 'vue';

@Component
export default class CommentFormVue extends Vue {
    @Prop({ required: true, type: Object as PropType<Comment> }) private value!: Comment;
}
</script>
