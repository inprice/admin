import Helper from './helper';

const baseURL = '/billing';

export default {

  async getInfo() {
    const res = await Helper.call('Invoice Info', { method: 'get', url: baseURL }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async saveInfo(form) {
    const res = await Helper.call('Invoice Info', { url: baseURL + '/save-info', data: form });
    return res.status;
  },

  getTransactions() {
    return Helper.call('Transactions', { method: 'get', url: baseURL + '/trans' }, false);
  },

};
