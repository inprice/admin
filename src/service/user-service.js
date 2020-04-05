/*eslint-disable no-unused-vars */
import ApiService from './api-service';
import Utility from '@/helpers/utility';

const baseURL = '/user';

export default {

  async changePassword(form) {
    try {
      let apiRes = await ApiService.put(baseURL + "/change-password", form);

      if (apiRes && apiRes.data.status === 0) {
        Utility.showInfoMessage('Change Password', 'Your password has been successfuly updated')
        return true;
      } else {
        Utility.showErrorMessage('Change Password', 'api', apiRes);
      }
    } catch (err) {
      Utility.showErrorMessage('Change Password', 'network', err);
    }

    return false;
  }

};
