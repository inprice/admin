import store from './store';
import moment from 'moment-timezone';
import numFormatter from 'number-format.js';

const SESSION = 'session/getCurrentStatus';

export default (Vue) => {
  Vue.filter('toPosition', (value) => {
    switch (value) {
      case 1:
        return 'LOWEST';
      case 2:
        return 'LOWER';
      case 3:
        return 'AVERAGE';
      case 4:
        return 'HIGHER';
      case 5:
        return 'HIGHEST';
    }
    return 'NOT SET';
  });

  Vue.filter('toDifferenceLine', (diff) => {
    if (diff != 0) {
      let dir = 'minus';
      let color = 'primary';
      if (diff > 0) {
        dir = 'up';
        color = 'success';
      } else {
        dir = 'down';
        color = 'red';
      }
      return numFormatter('#.00%', diff)+` <v-icon color="${color}">mdi-arrow-${dir}</v-icon>`;
    }
    return 'NA';
  });

  Vue.filter('toCurrency', (value, format) => {
    try {
      if (format) {
        return numFormatter(format, value);
      } else {
        return numFormatter(store.get(SESSION+'@currencyFormat'), value);
      }
      /* eslint-disable no-empty */
    } catch (error) { }
  });

  Vue.filter('toPrice', (value) => {
    try {
      return value.toFixed(2);
      /* eslint-disable no-empty */
    } catch (error) { }
    return 0;
  });

  Vue.filter('formatDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (tz && value) {
        return moment(value).tz(tz).fromNow();
      }
      /* eslint-disable no-empty */
    } catch (error) {
      console.error('Failed to format date', value, error);
     }
    return 'NA';
  });

  Vue.filter('formatUSDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (tz && value) {
        const a = moment(value).tz(tz);
        const dayDiff = a.diff(moment().tz(tz), 'days');
        if (dayDiff == 0) {
          return 'Today';
        } else if (dayDiff == 1) {
          return 'Tomorrow';
        }
        return a.format("MMM Do, YYYY");
      }
      /* eslint-disable no-empty */
    } catch (error) {
      console.error('Failed to format date', value, error);
    }
    return 'NA';
  });

  Vue.filter('formatStatus', (value) => {
    try {
      if (value) {
        return value.replaceAll('_', ' ');
      }
      /* eslint-disable no-empty */
    } catch (error) { }
    return 'NA';
  });

};
