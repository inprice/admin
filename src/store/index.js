import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify'
import session from './session';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    session
  },

  plugins: [
    pathify.plugin
  ],

  strict: process.env.DEV
});
