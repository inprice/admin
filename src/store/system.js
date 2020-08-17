import Helper from '../service/helper';
import { make } from 'vuex-pathify';

const baseURL = '/app';

const state = {
  cid: 0,
  plans: []
};

const actions = {

  async fetchPlans({ commit }) {
    const res = await Helper.call('Plans', { method: 'get', url: baseURL + '/plans' });
    if (res.status == true) {
      commit('SET_CID', res.data.cid);
      commit('SET_PLANS', res.data.plans);
    }
  },

};

const mutations = {
  ...make.mutations(state),

  SET_CID(state, cid) {
    state.cid = cid;
  },

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
