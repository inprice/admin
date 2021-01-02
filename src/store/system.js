import SystemService from '@/service/system';
import { make } from 'vuex-pathify';

const state = {
  plansSets: []
};

const actions = {

  async fetchPlans({ commit }) {
    SystemService.fetchPlans()
      .then((res) => {
        /*
        let plansSets = [];
        if (res && res.data) {
          let cell = 0;
          let pSet = [];
          for (let i = 0; i < res.data.length; i++) {
            if (cell == 3) {
              plansSets.push(pSet);
              pSet = [];
              cell = 0;
            }
            pSet.push(res.data[i]);
            cell++;
          }

          if (pSet.length > 0) {
            plansSets.push(pSet);
          }
        }
        commit('SET_PLANS', plansSets);
        */
       commit('SET_PLANS', res.data);
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
