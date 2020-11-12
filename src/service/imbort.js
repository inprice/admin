import Helper from './helper';
import store from '../store';

const baseURL = '/product/import';

export default {

  async get(id) {
    const res = await Helper.call('Import Details', { method: 'get', url: baseURL + '/' + id });
    return res;
  },

  async getList() {
    const res = await Helper.call('Import List', { method: 'get', url: baseURL + 's' }, false);
    return res;
  },

  async getDetailsList(id) {
    const res = await Helper.call('Import Details', { method: 'get', url: baseURL + '/details' + '/' + id }, false);
    return res;
  },

  async remove(id) {
    const res = await Helper.call('Delete Import', { method: 'delete', url: baseURL + '/' + id });
    return res.status;
  },

  async uploadCSV(formData) {
    const res = await Helper.call('CSV Import', { url: baseURL + '/file/csv', data: formData });
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
