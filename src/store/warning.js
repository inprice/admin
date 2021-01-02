const state = {
  title: 'Warning',
  text: '',
  action: '',
  counter: 0,
};

const mutations = {

  setMessage(state, message) {
    const notChanged = (message.text == state.text);
    if (message.title)
      state.title = message.title;
    else
      state.title = 'Warning';
    state.action = message.action;
    state.text = message.text;
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
