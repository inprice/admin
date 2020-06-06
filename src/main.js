import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dotenv from 'dotenv';
dotenv.config();

import vuetify from './plugins/vuetify';
import Filters from './filters';

Vue.config.productionTip = false

import Notifications from 'vue-notification';
Vue.use(Notifications);

import VueApexCharts from 'vue-apexcharts';
Vue.component('apexchart', VueApexCharts);

Filters(Vue);

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
