import Vue from 'vue'
import VueAxios from 'vue-axios';
import App from './App.vue'
import router from './router'

import vuetify from './plugins/vuetify';
import Notifications from 'vue-notification';

import axios from 'axios';
import dotenv from 'dotenv';
import Filters from './filters';

dotenv.config();

import ApiService from './service/api';

Vue.config.productionTip = false

Vue.use(VueAxios, axios);
Vue.use(Notifications);

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_BASE_URL);

Filters(Vue);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
