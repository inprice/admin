import Helper from './helper';
import store from '../store';

const baseURL = '/product/import';

export default {

  async uploadCSV(formData) {
    const res = await Helper.call('CSV Import', { url: baseURL + '/csv', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'CSV file has been successfully uploaded' });
    return res;
  },

  async uploadURL(formData) {
    const res = await Helper.call('URL Import', { url: baseURL + '/url-list', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'URL list file has been successfully uploaded' });
    return res;
  },

  async uploadEbaySKU(formData) {
    const res = await Helper.call('Ebay SKU Import', { url: baseURL + '/ebay-sku', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Ebay SKU list file has been successfully uploaded' });
    return res;
  },

  async uploadAmazonASIN(formData) {
    const res = await Helper.call('ASIN Import', { url: baseURL + '/amazon-asin', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'ASIN list file has been successfully uploaded' });
    return res;
  },

};
