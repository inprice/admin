import Helper from './helper';

const baseURL = '/company';

export default {

  async get() {
    const res = await Helper.call('Company', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async getCoupons() {
    const res = await Helper.call('Company Coupons', { method: 'get', url: baseURL + '/coupons' }, false);
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async applyCoupon(code) {
    const res = await Helper.call('Apply Coupon', { method: 'put', url: baseURL + '/apply-coupon/' + code });
    return res;
  },

  async create(form) {
    const res = await Helper.call('Create Company', { method: 'post', url: baseURL, data: form });
    return res.status;
  },

  async update(form) {
    const res = await Helper.call('Update Company', { method: 'put', url: baseURL, data: form });
    return res.status;
  }

};
