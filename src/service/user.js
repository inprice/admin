/*eslint-disable no-unused-vars */
import Helper from './helper';
import Utility from '@/helpers/utility';

const baseURL = '/user';

export default {

  async updateUserName(form) {
    const res = await Helper.call('Update Name', { method: 'put', url: baseURL + '/update-name', data: { value: form.userName } });
    if (res.status == true) Utility.showInfoMessage('Update Name', 'Your name has been successfuly updated');
    return res.status;
  },

  async changePassword(form) {
    const res = await Helper.call('Change Password', { method: 'put', url: baseURL + '/change-password', data: form });
    if (res.status == true) Utility.showInfoMessage('Change Password', 'Your password has been successfuly changed');
    return res.status;
  },

  async getOpenedSessions() {
    const res = await Helper.call('Getting Sessions', { method: 'get', url: baseURL + '/opened-sessions' });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async closeAllSessions() {
    const res = await Helper.call('Closing Sessions', { method: 'post', url: baseURL + '/close-all-sessions' });
    return (res.status == true);
  }

};
