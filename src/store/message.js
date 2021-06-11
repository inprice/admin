import ApiService from '../service/api';

const state = {
  announces: [],
};

const actions = {

  fetchAnnounces({ state }) {
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
    ApiService.put('/announce')
      .then((res) => {
        if (res && res.status) {
          state.announces = [];
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
