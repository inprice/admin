import numeral from 'numeral';
import moment from 'moment';

export default (Vue) => {
  Vue.filter('toCurrency', (value) => {
    return numeral(value).format('0.00');
  });

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

  Vue.filter('toDifferenceLine', (price, basePrice) => {
    if (price > 0 && basePrice > 0) {
      let dir = 'minus';
      let color = 'primary';
      let diff = 0;
      if (price > basePrice) {
        dir = 'up';
        color = 'success';
        diff = price / basePrice;
      } else {
        dir = 'down';
        color = 'red';
        diff = basePrice / price;
      }
      return numeral(diff).format('0.00%')+` <v-icon color="${color}">mdi-arrow-${dir}</v-icon>`;
    }
  });

  Vue.filter('formatDateOnly', (value) => {
    if (value) {
      return moment(String(value)).format('DD MMM, YYYY');
    }
  });
};
