import Helper from './helper';
import Utility from '@/helpers/utility';

const baseURL = '/product/import';

export default {

  async uploadCSV(formData) {
    const res = await Helper.call('CSV Import', { url: baseURL + '/csv', data: formData });
    if (res.status == true) Utility.showInfoMessage('Product Import', 'CSV file has been successfully uploaded')
    return res.status;
  },

};
