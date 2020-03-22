import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isPlaying: false
  },
  mutations: {
    mutateIsPlayingState(state, payload) {
      state.isPlaying = payload
    }
  },
  actions: {
    changeIsPlayingState({ commit }, payload) {
      commit("mutateIsPlayingState", payload)
    }
  },
  modules: {}
});
