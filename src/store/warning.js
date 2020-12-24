const state = {
  title: '',
  text: '',
};

const actions = {

  youMustBeEditor({ state }) {
    state.text = 'Only those users having Editor role are allowed!'
  },

  youMustBeAdmin({ state }) {
    state.text = 'You must be Admin to do this action!'
  },

};

const mutations = {

  setMessage(state, message) {
    if (message.title)
      state.title = message.title;
    else
      state.title = 'Warning';
    state.text = message.text;
  }

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
