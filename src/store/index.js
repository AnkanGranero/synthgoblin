import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isPlaying: false,
    playingDiv: { x:10 , y: 10, refName: "r10,10"}
  },
  mutations: {
    changeIsPlayingState(state, payload) {
      state.isPlaying = payload
    },
    changePlayingDiv(state, payload) {
      state.playingDiv = payload
    }
  },
  actions: {
    changeIsPlayingState({ commit }, payload) {
      commit("changeIsPlayingState", payload)
    },
    setPlayingDiv({commit}, payload) {
      commit("changePlayingDiv", payload)
    }
  },
  modules: {}
});
