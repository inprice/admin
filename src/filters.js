import store from './store';
import moment from 'moment-timezone';
import numFormatter from 'number-format.js';

const SESSION = 'session/getCurrentStatus';

const longDateFormat_lg = "YYYY-MM-DD HH:mm";
const longDateFormat_sm = "DD MMM, HH:mm";

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

  Vue.filter('formatPlainDate', (value, screen) => {
    try {
      let format = longDateFormat_lg;
      if (screen && (screen == 'xs' || screen == 'sm')) {
        format = longDateFormat_sm;
      }

      const tz = store.get(SESSION+'@timezone');
      if (value) {
        if (tz) {
          return moment.utc(value).tz(tz).format(format);
        } else {
          return moment(value).format(format);
        }
      }
      /* eslint-disable no-empty */
    } catch (error) {
      console.error('Failed to format date', value, error);
     }
    return '-';
  });

  Vue.filter('formatDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (value) {
        if (tz) {
          return moment.utc(value).tz(tz).fromNow();
        } else {
          return moment(value).fromNow();
        }
      }
      /* eslint-disable no-empty */
    } catch (error) {
      console.error('Failed to format date', value, error);
     }
    return '-';
  });

  Vue.filter('formatRate', (value) => {
    if (value) {
      return value.toFixed(2) +' %';
    } 
    return value;
  });

  Vue.filter('formatUSDate', (value) => {
    try {
      const tz = store.get(SESSION+'@timezone');
      if (tz && value) {
        const a = moment.utc(value).tz(tz);
        const dayDiff = a.diff(moment.utc().tz(tz), 'days');
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
    return '-';
  });

};
