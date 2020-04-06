/*eslint-disable no-unused-vars */
import Helper from './helper';
import Utility from '@/helpers/utility';

const baseURL = '/user';

export default {

  async changePassword(form) {
    const res = await Helper.call('Change Password', { method: 'put', url: baseURL + '/change-password', data: form });
    if (res.status == true) Utility.showInfoMessage('Change Password', 'Your password has been successfuly updated');
    return res.status;
  }

};
