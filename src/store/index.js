import Vue from 'vue';
import Vuex from 'vuex';
import pathify from 'vuex-pathify'
import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth
  },

  plugins: [
    pathify.plugin
  ],

  strict: process.env.DEV
});
