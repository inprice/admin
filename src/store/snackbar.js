const state = {
  text: '',
  color: 'info',
  level: 'info',
  timeout: 3500,
  centered: false,
  closeButton: true,
  counter: 0,
};

const actions = {

  notAllowed({ commit }) {
    commit('setMessage', { text: 'Your are not allowed to update any data' });
  }

};

const mutations = {

  setMessage(state, message) {
    const notChanged = (message.text == state.text);
    state.text = message.text;
    state.closeButton = (message.closeButton !== undefined ? message.closeButton : true);
    state.timeout = (message.timeout !== undefined ? message.timeout : 3500);
    state.centered = (message.centered !== undefined ? message.centered : false);

    if (!message.color || message.color == undefined) {
      if (message.level) state.level = message.level;
      switch (message.level) {
        case 'error': {
          state.color = 'red';
          break;
        }
        default: {
          state.color = 'cyan darken-2';
          break;
        }
      }
    } else {
      state.color = message.color;
    }
    if (!notChanged) {
      state.counter++;
    } else {
      state.counter = 0;
    }
  }

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
