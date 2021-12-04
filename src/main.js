import Vue from 'vue'
import moment from 'moment-timezone';
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

import pluralize from 'pluralize'

Vue.mixin({
  methods: {
    findPositionColor(position) {
      switch (position) {
        case 'Lowest': return 'green';
        case 'Low': return '#48D1CC';
        case 'Average': return 'primary';
        case 'Equal': return 'blue';
        case 'High': return '#FF6347';
        case 'Highest': return 'red';
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
    normalizeEnum(name) {
      if (name) {
        return name.toLowerCase().replaceAll('_', ' ');
      }
      return name;
    },
    isNumeric(value) {
      return /^-?\d+$/.test(value);
    },
    pluralize(value, number) {
      return pluralize(value, number);
    },
    formatDate(value, tz) {
      try {
        if (value) {
          if (tz) {
            return moment.utc(value).tz(tz).fromNow();
          } else {
            return moment(value).fromNow();
          }
        }
      } catch (error) {
        console.error('Failed to format date (main.js)', value, error);
      }
      return '-';
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
