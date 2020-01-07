import Vue from 'vue';

import ErrorVue from '@/components/Error.vue';
import LoaderVue from '@/components/Loader.vue';
import SelectVue from '@/components/Select.vue';
import SliderVue from '@/components/Slider.vue';
import IconButtonVue from '@/components/IconButton.vue';

Vue.component('Error', ErrorVue);
Vue.component('Loader', LoaderVue);
Vue.component('grad-select', SelectVue);
Vue.component('grad-slider', SliderVue);
Vue.component('grad-icon-btn', IconButtonVue);
