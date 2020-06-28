<template>
  <div>
    <router-link :to="destination" tag="button" class="grad_back_btn">
      <i class="material-icons">arrow_back</i>
    </router-link>
  </div>

</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
export default class ButtonVue extends Vue {
    @Prop({ default: '/' }) private destination!: string;
}
</script>

<style scoped lang="scss">
  @import '~@/colors.scss';
.grad_back_btn {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  position: absolute;
  left: 4vw;
  bottom: 2em;
  cursor: pointer;
  background-color: $color-active;
}
</style>
