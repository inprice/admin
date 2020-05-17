import { make } from 'vuex-pathify';

const state = {
  importProduct: {
    type: '',
    rows: [],
  }
};

const mutations = {
  ...make.mutations(state),

  SET_IMPORT_REPORT(state, data) {
    state.importProduct = data;
  }

};

const getters = make.getters(state);

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
