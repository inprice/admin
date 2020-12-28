const state = {
  text: '',
  color: 'info',
  level: 'info',
  counter: 0,
};

const mutations = {

  setMessage(state, message) {
    const notChanged = (message.text == state.text);
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
  mutations
};
