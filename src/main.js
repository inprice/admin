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

import './assets/css/main.css';

/* eslint-disable no-unused-vars */
//import ChartDataLabels from 'chartjs-plugin-datalabels';

import Chart from 'chart.js'
Chart.defaults.global.defaultFontFamily = 'Ubuntu';

import VueMask from 'v-mask'
Vue.use(VueMask);

import VuePageTransition from 'vue-page-transition';
Vue.use(VuePageTransition);

Vue.component('ago', () => import('./component/simple/Ago.vue'));

Vue.mixin({
  methods: {
    findLevelColor(level) {
      switch (level) {
        case 'LOWEST': case 'MIN': return 'blue';
        case 'LOWER': return 'green';
        case 'AVERAGE': return 'primary';
        case 'HIGHER': return 'pink';
        case 'HIGHEST': case 'MAX': return 'red';
      }
    },
    async copyToClipboard(sourceText) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(sourceText);
      } else {
        let textArea = document.createElement("textarea");
        textArea.value = sourceText;
        textArea.style.position = "absolute";
        textArea.style.opacity = 0;
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        await document.execCommand('copy');
        textArea.remove();
      }
    }
  },
})

Chart.defaults.global.legend.display = false;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
