const state = {
  text: '',
  color: 'info'
};

const mutations = {

  setMessage(state, message) {
    state.text = message.text;
    state.color = (message.color ? message.color : 'cyan darken-2');
  }

};

export default {
  namespaced: true,
  state,
  mutations
};
