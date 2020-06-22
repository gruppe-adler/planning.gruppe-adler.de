<template>
  <router-view/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { setApiUri } from '@gruppe-adler/maps-frontend-utils';

@Component
export default class AppVue extends Vue {
    private created () {
        setApiUri('https://maps.gruppe-adler.de');
    }
}
</script>

<style lang="scss" src="./global.scss"></style>
