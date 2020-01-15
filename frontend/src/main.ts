import Vue from 'vue';
import App from './App.vue';
// import './registerServiceWorker';
import './plugins/globalComponents';
import router from './router';
import store, { RootState } from './store';
import { Store } from 'vuex';

Vue.config.productionTip = false;

// Set $tstore to be a getter that simply returns $store.
Object.defineProperty(Vue.prototype, '$tstore', {
    get: function() {
        return this.$tstore as Store<RootState>;
    },
    enumerable: true
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
