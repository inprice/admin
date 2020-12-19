const state = {
  text: '',
  color: 'info',
  level: 'info',
};

const mutations = {

  setMessage(state, message) {
    state.text = message.text;
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
  }

};

export default {
  namespaced: true,
  state,
  mutations
};
