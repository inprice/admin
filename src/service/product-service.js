import ApiService from './api-service';
import Utility from '@/helpers/utility';

const serviceName = 'Product';
const baseURL = '/product';

export default {

  async save(form) {
    try {
      let apiRes = null;
      
      let opType = 'added';
      if (form.id && form.id > 0) {
        opType = 'edited';
        apiRes = await ApiService.put(baseURL, form);
      } else {
        apiRes = await ApiService.post(baseURL, form);
      }

      if (apiRes && apiRes.data.status === 0) {
        Utility.showInfoMessage(serviceName, form.name + ' has been successfuly ' + opType)
        return true;
      } else {
        Utility.showErrorMessage(serviceName, 'api', apiRes);
      }
    } catch (err) {
      Utility.showErrorMessage(serviceName, 'network', err);
    }

    return false;
  },

  async search(form) {
    try {
      const apiRes = await ApiService.get(baseURL + 's/search', form);

      if (apiRes && apiRes.data.status === 0) {
        return apiRes.data.data.rows;
      } else {
        Utility.showErrorMessage(serviceName, 'api', apiRes);
      }
    } catch (err) {
      Utility.showErrorMessage(serviceName, 'network', err);
    }

    return null;
  },

  async toggle(id) {
    try {
      const apiRes = await ApiService.put(baseURL + '/toggle/' + id);

      if (apiRes && apiRes.data.status === 0) {
        return true;
      } else {
        Utility.showErrorMessage(serviceName, 'api', apiRes);
      }
    } catch (err) {
      Utility.showErrorMessage(serviceName, 'network', err);
    }

    return false;
  },

  async remove(id) {
    try {
      const apiRes = await ApiService.delete(baseURL + '/' + id);

      if (apiRes && apiRes.data.status === 0) {
        return true;
      } else {
        Utility.showErrorMessage(serviceName, 'api', apiRes);
      }
    } catch (err) {
      Utility.showErrorMessage(serviceName, 'network', err);
    }

    return false;
  }

};
