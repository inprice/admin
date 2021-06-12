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

import ChartJsPluginDataLabels from 'chartjs-plugin-datalabels';

import Chart from 'chart.js'
Chart.defaults.global.defaultFontFamily = 'Ubuntu';

import VueMask from 'v-mask'
Vue.use(VueMask);

import VuePageTransition from 'vue-page-transition';
Vue.use(VuePageTransition);

Vue.component('ago', () => import('./component/simple/Ago.vue'));
Vue.component(ChartJsPluginDataLabels);

function deepEqual(x, y) {
  return (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
      Object.keys(x).reduce(function(isEqual, key) {
        return isEqual && deepEqual(x[key], y[key]);
      }, true) : (x == y);
}

Vue.mixin({
  methods: {
    findLevelColor(level) {
      switch (level) {
        case 'EQUAL': return 'blue';
        case 'LOWEST': return 'green';
        case 'LOWER': return 'cyan';
        case 'AVERAGE': return 'primary';
        case 'HIGHER': return 'red';
        case 'HIGHEST': return 'pink';
      }
    },
    findDiffIcon(diffAmount) {
      if (diffAmount < 0) return 'mdi-arrow-down';
      if (diffAmount == 0) return 'mdi-arrow-minus';
      return 'mdi-arrow-up';
    },
    findDiffColor(diffAmount) {
      if (diffAmount < 0) return 'green';
      if (diffAmount == 0) return 'blue';
      return 'red';
    },
    findStatusColor(status) {
      if (status == 'ACTIVE') return 'green';
      if (status == 'TRYING') return 'orange';
      if (status == 'WAITING') return 'blue';
      return 'red';
    },
    findStatusBackColor(status) {
      if (status == 'ACTIVE') return '#daffa6';
      if (status == 'TRYING') return '#ffe069';
      if (status == 'WAITING') return '#b4ffff';
      return '#fffebe';
    },
    deepEqual,
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
    },
  },
})

Chart.defaults.global.legend.display = false;

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
