import SystemService from '@/service/system';
import { make } from 'vuex-pathify';

const state = {
  plansSets: []
};

const actions = {

  async fetchPlans({ commit }) {
    SystemService.fetchPlans()
      .then((res) => {
        if (res && res.data) {
          commit('SET_PLANS', res.data);
        }
      });
  },

};

const mutations = {

  SET_PLANS(state, plansSets) {
    state.plansSets = plansSets;
  }

}

const getters = {
  ...make.getters(state),
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
