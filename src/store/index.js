import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isPlaying: false,
    playingDiv: { x:10 , y: 10, refName: "r10,10"},
    backgroundColors: "",
    arrowRefs: [],
    direction: ""
  },
  mutations: {
    changeIsPlayingState(state, payload) {
      state.isPlaying = payload
    },
    changePlayingDiv(state, payload) {
      state.playingDiv = payload
    },
    changeBackgroundColors(state, payload) {
      state.backgroundColors = payload
    },
    addArrowRef(state, payload) {
      state.arrowRefs.push(payload);
    },
    removeArrowRef(state, getters, payload) {
       
      let index = getters.findArrowRefIndex(payload.refName);
      console.log("lets remove", index);

      if (index !== -1) {
        state.arrowRefs.splice(index, 1);
        console.log("removed ", this.arrowRefs);
      }

    },
    changeDirectionOnArrowRef(state , payload) {
      let { index, direction } = payload;
      state.arrowRefs[index].direction = direction;
    },
    setDirection(state, payload) {
      state.direction = payload
    }
  },
  actions: {
    changeIsPlayingState({ commit }, payload) {
      commit("changeIsPlayingState", payload)
    },
    setPlayingDiv({commit}, payload) {
      console.log("sätter playing div",payload);
      
      commit("changePlayingDiv", payload)
    },
    setBackgroundColors({commit}, payload) {
      commit("changeBackgroundColors", payload)
  
    },
    addArrowRef( {  commit, getters }, payload) {
      let { x, y, direction, refName } = payload;

      let indexOfDuplicate = getters.findArrowRefIndex(refName);
      console.log("adding arrow", indexOfDuplicate);
      
      if (indexOfDuplicate !== -1) {
        commit("changeDirectionOnArrowRef", { index: indexOfDuplicate, direction})
        return;
      }
      commit("addArrowRef",{ x, y, refName, direction: direction });
    },
    removeArrowRef( {commit}, payload) {
      commit("removeArrowRef", payload);
    },
    setDirection( {commit}, payload) {
      commit("setDirection", payload)
    }
  },
  getters: {
  findArrowRefIndex: (state) => (refName) => {
    let index = state.arrowRefs.findIndex(ref => ref.name == refName);
    return index;
  },
    findArrowRef: (state) => (refName) => {
   let arrowRef = state.arrowRefs.filter(ref => ref.refName == refName);
    return arrowRef[0]
  },
  getArrowRefs: (state) => {
    return state.arrowRefs;
  },
  getPlayingDiv: (state) => {
   return state.playingDiv
  },
},
  modules: {}
});
