import Helper from './helper';

const baseURL = '/dashboard';

export default {

  async getReport() {
    const res = await Helper.call('Dashboard', { method: 'get', url: baseURL });
    if (res.status == true && res.data) return res;
    return {};
  },

  async refresh() {
    const res = await Helper.call('Dashboard', { method: 'get', url: baseURL + '/refresh' });
    if (res.status == true && res.data) return res;
    return {};
  }

};
