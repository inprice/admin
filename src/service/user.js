/*eslint-disable no-unused-vars */
import Helper from './helper';
import store from '../store';

const baseURL = '/user';

export default {

  async update(form) {
    const res = await Helper.call('Update User', { method: 'put', url: baseURL + '/update', data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Your info has been successfully updated' });
    return res.status;
  },

  async changePassword(form) {
    const res = await Helper.call('Change Password', { method: 'put', url: baseURL + '/change-password', data: form });
    if (res.status == true) store.commit('snackbar/setMessage', { text: 'Your password has been successfully changed' });
    return res.status;
  },

  async getInvitations() {
    const res = await Helper.call('Getting Invitations', { method: 'get', url: baseURL + '/invitations' });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async acceptInvitation(id) {
    const res = await Helper.call('Accept Invitation', { method: 'put', url: baseURL + '/accept-invitation', data: { value: id } });
    return res.status;
  },

  async rejectInvitation(id) {
    const res = await Helper.call('Reject Invitation', { method: 'put', url: baseURL + '/reject-invitation', data: { value: id } });
    return res.status;
  },

  async getMemberships() {
    const res = await Helper.call('Memberships', { method: 'get', url: baseURL + '/memberships' });
    if (res.status == true && res.data) return res.data;
    return null;
  },

  async leaveMember(id) {
    const res = await Helper.call('Leave Member', { method: 'put', url: baseURL + '/leave-member', data: { value: id } });
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
