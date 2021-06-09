import ApiService from '../service/api';

const state = {
  announces: [],
};

const actions = {

  fetchAnnounces({ commit }) {
    ApiService.get('/announces/new')
      .then((res) => {
        if (res && res.data) {
          commit('setAnnounces', res.data.data);
        } else {
          commit('setAnnounces', []);
        }
      })
      .catch((err) => {
        console.error('fetchAnnounces', err);
        commit('setAnnounces', []);
      });
  },

};

const mutations = {

  setAnnounces(state, announces) {
    state.announces = announces;
  },

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
  mutations,
  getters
};
