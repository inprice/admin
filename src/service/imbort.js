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

  async uploadCSVFile(formData) {
    const res = await Helper.call('CSV File', { url: baseURL + '/file/csv', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'CSV file has been successfully uploaded' });
    return res;
  },

  async uploadCSVList(content) {
    const res = await Helper.call('CSV List', { url: baseURL + '/list/csv', data: content });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'CSV list has been successfully uploaded' });
    return res;
  },

  async uploadURLFile(formData) {
    const res = await Helper.call('URL Import', { url: baseURL + '/file/url', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'URL list file has been successfully uploaded' });
    return res;
  },

  async uploadURLList(content) {
    const res = await Helper.call('URL List', { url: baseURL + '/list/url', data: content });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'URL list has been successfully uploaded' });
    return res;
  },

  async uploadEbaySKUFile(formData) {
    const res = await Helper.call('Ebay SKU File', { url: baseURL + '/file/ebay', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Ebay SKU file file has been successfully uploaded' });
    return res;
  },

  async uploadEbaySKUList(content) {
    const res = await Helper.call('Ebay SKU List', { url: baseURL + '/list/ebay', data: content });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Ebay SKU list file has been successfully uploaded' });
    return res;
  },

  async uploadAmazonASINFile(formData) {
    const res = await Helper.call('Amazon ASIN File', { url: baseURL + '/file/amazon', data: formData });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'ASIN list file has been successfully uploaded' });
    return res;
  },

  async uploadAmazonASINList(content) {
    const res = await Helper.call('Amazon ASIN List', { url: baseURL + '/list/amazon', data: content });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Amazon ASIN list file has been successfully uploaded' });
    return res;
  },

};
