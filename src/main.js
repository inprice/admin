import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dotenv from 'dotenv';
dotenv.config();

import vuetify from './plugins/vuetify';
import Filters from './filters';


Vue.config.productionTip = false

Filters(Vue);

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.use(Loading, {
  color: '#FF3800',
  width: 48,
  backgroundColor: '#f0f0f0'
});

import './assets/css/main.css';
import './assets/css/rainbow.css';
import './mixins/common-functions'

import Chart from 'chart.js'
/* eslint-disable no-unused-vars */
import ChartDataLabels from 'chartjs-plugin-datalabels';

import VueMask from 'v-mask'
Vue.use(VueMask);

Vue.component('ago', () => import('./component/simple/Ago.vue'));

Chart.defaults.global.legend.display = false;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
