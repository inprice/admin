import Helper from '../service/helper';
import { make } from 'vuex-pathify';

const baseURL = '/app';

const state = {
  plans: []
};

const actions = {

  async fetchPlans({ commit }) {
    const res = await Helper.call('Plans', { method: 'get', url: baseURL + '/plans' });
    if (res.status == true) {
      commit('SET_PLANS', res.data);
    }
  },

};

const mutations = {
  ...make.mutations(state),

  SET_PLANS(state, plans) {
    state.plans = plans;
  },

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
