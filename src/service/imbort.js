import Helper from './helper';
import Utility from '@/helpers/utility';

const baseURL = '/product/import';

export default {

  async search(form) {
    const res = await Helper.call('Imported Products', { method: 'get', url: baseURL + 's/search' + Helper.toQueryString(form) });
    if (res.status == true && res.data.rows) return res.data.rows;
    return null;
  },

  async uploadCSV(formData) {
    const res = await Helper.call('CSV Import', { url: baseURL + '/csv', data: formData });
    if (res.status == true) Utility.showInfoMessage('Product Import', 'CSV file has been successfully uploaded')
    return res;
  },

  async uploadEbaySKU(formData) {
    const res = await Helper.call('Ebay SKU Import', { url: baseURL + '/ebay-sku', data: formData });
    if (res.status == true) Utility.showInfoMessage('Product Import', 'Ebay SKU list file has been successfully uploaded')
    return res;
  },

  async uploadAmazonASIN(formData) {
    const res = await Helper.call('ASIN Import', { url: baseURL + '/amazon-asin', data: formData });
    if (res.status == true) Utility.showInfoMessage('Product Import', 'ASIN list file has been successfully uploaded')
    return res;
  },

  async remove(id) {
    const res = await Helper.call('Remove Row', { url: baseURL + '/' + id, method: 'delete' });
    return res.status;
  },

};
