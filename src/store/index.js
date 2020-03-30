import Vue from 'vue';
import Vuex from 'vuex';

import product from './product';

Vue.use(Vuex);

const Store = () => {
  return new Vuex.Store({
    modules: {
      product
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });
};

export default Store;
