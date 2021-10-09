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

Vue.mixin({
  methods: {
    findPositionColor(position) {
      switch (position) {
        case 'EQUAL': return 'blue';
        case 'LOWEST': return 'green';
        case 'LOWER': return 'darkcyan';
        case 'AVERAGE': return 'primary';
        case 'HIGHER': return 'pink';
        case 'HIGHEST': return 'red';
      }
    },
    findDiffColor(diffAmount) {
      if (diffAmount < 0) return 'green';
      if (diffAmount == 0) return 'blue';
      return 'red';
    },
    findDiffIcon(diffAmount) {
      if (diffAmount < 0) return 'mdi-arrow-bottom-left';
      if (diffAmount == 0) return 'mdi-minus';
      return 'mdi-arrow-top-right';
    },
    findStatusColor(status) {
      if (status == 'ACTIVE') return 'green';
      if (status == 'WAITING') return 'orange';
      if (status == 'TRYING') return 'cyan';
      return 'red';
    },
    findStatusBackColor(status) {
      if (status == 'ACTIVE') return '#daffa6';
      if (status == 'WAITING') return '#b4ffff';
      if (status == 'TRYING') return '#ffe069';
      return '#fffebe';
    },
    findStatusIcon(status) {
      if (status == 'ACTIVE') return 'mdi-play-circle-outline';
      if (status == 'WAITING') return 'mdi-pause-circle-outline';
      if (status == 'TRYING') return 'mdi-stop';
      return 'mdi-close-circle-outline';
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
