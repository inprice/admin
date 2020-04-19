import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import dotenv from 'dotenv';
dotenv.config();

import vuetify from './plugins/vuetify';
import Notifications from 'vue-notification';
import Filters from './filters';

Vue.config.productionTip = false

Vue.use(Notifications);

Filters(Vue);

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
