import { Store } from 'vuex';
import { RootState } from './store';
import Vue from 'vue';

declare module 'vue/types/vue' {

  interface Vue {
    $tstore: Store<RootState>;
  }
}

declare module '*.vue' {
  export default Vue;
}
