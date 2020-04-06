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
import SessionService from './service/session';

Vue.config.productionTip = false

Vue.use(VueAxios, axios);
Vue.use(Notifications);

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_BASE_URL);

// If token exists set header
if (SessionService.getAccessToken()) {
  ApiService.setHeader(SessionService.getAccessToken());
}

Filters(Vue);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
