import store from './store';
import moment from 'moment-timezone';
import numFormatter from 'number-format.js';

const session = 'auth/session';

export default (Vue) => {
  Vue.filter('toPosition', (value) => {
    switch (value) {
      case 1:
        return 'Lowest';
      case 2:
        return 'Lower';
      case 3:
        return 'Average';
      case 4:
        return 'Higher';
      case 5:
        return 'Highest';
    }
    return 'Not Yet';
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

  Vue.filter('toCurrency', (value) => {
    try {
      return numFormatter(store.get(session+'@currencyFormat'), value);
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
      if (value) {
        return moment(value).tz(store.get(session+'@timezone')).fromNow();
      }
      /* eslint-disable no-empty */
    } catch (error) { }
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
