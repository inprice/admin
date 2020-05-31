import store from './store';
import moment from 'moment-timezone';
import numFormatter from 'number-format.js';

const session = 'auth/session';

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
    return 'NOT YET';
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

  Vue.filter('formatDate', (value) => {
    try {
      if (value) {
        return moment(value).tz(store.get(session+'@timezone')).format('YYYY-MM-DD HH:mm');
      }
      /* eslint-disable no-empty */
    } catch (error) { }
    return 'NA';
  });

};
