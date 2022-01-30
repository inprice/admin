import ApiService from '../service/api';
import store from '../store';

const state = {
  announces: [],
};

const actions = {

  fetchAnnounces({ state }) {
    if (store.get('session/isSuperUser')) return;

    ApiService.get('/announces/new')
      .then((res) => {
        if (res && res.data) {
          state.announces = res.data.data;
        } else {
          state.announces = [];
        }
      })
      .catch((err) => {
        console.error('fetchAnnounces', err);
        state.announces = [];
      });
  },

  markAllAnnouncesAsRead({ state }) {
    if (store.get('session/isSuperUser') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    ApiService.put('/announce')
      .then((res) => {
        if (res && res.status) {
          state.announces = [];
        }
      });
  },

  markAnAnnounceAsRead({ state }, id) {
    if (store.get('session/isSuperUser') || store.get('session/isDemoUser')) {
      store.dispatch('snackbar/notAllowed');
      return;
    }

    ApiService.put('/announce/'+id)
      .then((res) => {
        if (res && res.data && res.data.ok) {
          state.announces = res.data.data;
        }
      });
  }
};

const getters = {

  getAnnounces: (state) => {
    return state.announces;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  getters
};
