import { make } from 'vuex-pathify';

const state = {
  plans: []
};

const actions = {

  async fetchPlans() {
   return false;
  },

};

const mutations = {
  ...make.mutations(state),
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
