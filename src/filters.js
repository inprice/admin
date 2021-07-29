import store from './store';
import moment from 'moment-timezone';
import numFormatter from 'number-format.js';

const SESSION = 'session/getCurrentStatus';

const longDateFormat = "YYYY-MM-DD HH:mm:ss";

export default (Vue) => {

  Vue.filter('toCurrency', (value, format) => {
    try {
      if (format) {
        return numFormatter(format, value);
      } else if (store.get(SESSION+'@currencyFormat')) {
        return numFormatter(store.get(SESSION+'@currencyFormat'), value);
      } else {
        return numFormatter('#,##0.00', value);
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

  Vue.filter('formatPlainDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (value) {
        if (tz) {
          return moment(value).tz(tz).format(longDateFormat);
        } else {
          return moment(value).format(longDateFormat);
        }
      }
      /* eslint-disable no-empty */
    } catch (error) {
      console.error('Failed to format date', value, error);
     }
    return 'NA';
  });

  Vue.filter('formatDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (value) {
        if (tz) {
          return moment(value).tz(tz).fromNow();
        } else {
          return moment(value).fromNow();
        }
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

};
