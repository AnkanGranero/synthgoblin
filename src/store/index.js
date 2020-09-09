import Vue from "vue";
import Vuex from "vuex";
import { getMidiOutputFromLocalStorage, setOutputDevice } from "../midi-service/midiService"
import { createAllArpeggios } from "../utils/pitchCalculations";
import { changeBpm, changeReverb } from "../playStuff/playStuff"

Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    isPlaying: false,
    playingDiv: null,
    backgroundColors: "",
    arrowRefs: [],
    direction: "",
    gridSize: {
        x: 15,
        y: 15
    },
    arpeggio: [4, 3, 4, 1],
    allArpeggios: [],
    isMobile: false,
    angle: "symetric",
/*     midiOutput: null, */
    midiOutActive: false,
    modalIsOpen: false
  },
  mutations: {
    changeIsPlayingState(state, payload) {
      state.isPlaying = payload;
    },
    changePlayingDiv(state, payload) {
      state.playingDiv = payload;
    },
    changeBackgroundColors(state, payload) {
      state.backgroundColors = payload;
    },
    addArrowRef(state, payload) {
      state.arrowRefs.push(payload);
    },
    removeArrowRef(state, payload) {
      
      let index = this.getters.findArrowRefIndex(payload);

      if (index !== -1) {
        state.arrowRefs.splice(index, 1);
      }
    },
    clearAllArrowRefs(state) {
      state.arrowRefs = []
    },
    changeDirectionOnArrowRef(state, payload) {
      let { index, direction } = payload;
      state.arrowRefs[index].direction = direction;
    },
    setDirection(state, payload) {
      state.direction = payload;
    },
    setGridSize(state, payload) {
      let { name, val} = payload;
      state.isPlaying = false;
      state.gridSize[name] = val;

    },
    setArpeggio(state, payload) {
        
      state.arpeggio = payload
      
    },
      isMobile(state) {
      state.isMobile = true;
      },

      setAllArpeggios(state,payload) {
        state.allArpeggios = payload
      },
      setAngle(state, payload) {
        console.log("set angle");
        state.angle = payload
      },
/*       setMidiOutput(state, payload) {
        state.midiOutput = payload
      }, */
      setModal(state, payload) {
        state.modalIsOpen = payload;
      },
      toggleMidiOutActive(state) {
        state.midiOutActive = !state.midiOutActive;

      }

  },
  actions: {
    modalIsOpen({ commit }, payload) {

      commit("setModal", payload);

    },
    changeIsPlayingState({ commit }, payload) {
      commit("changeIsPlayingState", payload);
    },
    setPlayingDiv({ commit }, payload) {
      commit("changePlayingDiv", payload);
    },
    setBackgroundColors({ commit }, payload) {
      commit("changeBackgroundColors", payload);
    },
    addArrowRef({ commit, getters }, payload) {
      let { x, y, direction, refName } = payload;

      let indexOfDuplicate = getters.findArrowRefIndex(refName);

      if (indexOfDuplicate !== -1) {
        commit("changeDirectionOnArrowRef", {
          index: indexOfDuplicate,
          direction
        });
        return;
      }
      commit("addArrowRef", { x, y, refName, direction: direction });
    },
    removeArrowRef({ commit }, payload) {
     
      commit("removeArrowRef", payload);
    },
    setDirection({ commit }, payload) {
      commit("setDirection", payload);
    },
    changeGridSize({commit, dispatch}, payload) {
      commit("changeIsPlayingState",false);
      commit("setGridSize", payload);
      dispatch("setAllArpeggios");

    },
    changeArpeggio({commit,dispatch}, payload) {
      commit("setArpeggio", payload);
      dispatch("setAllArpeggios");

    },
    changeGridMaxValue({commit}, payload) {
        commit("setGridMaxValue", Number(payload))
    },
    setAllArpeggios({commit, state}) {
      let newArpeggios = createAllArpeggios(state.arpeggio, state.gridSize, state.angle);
      commit("setAllArpeggios", newArpeggios)
    },
    changeAngle({commit}, payload) {
      commit("setAngle", payload)
    },

    toggleMidiOutActive({commit, dispatch}) {
      commit("toggleMidiOutActive");
      dispatch("setMidiOutputFromCache");
    },
 /*    changeMidi({rootstate}, payload) {
      console.log("window",rootstate, payload);
     eval("changeMidi"+ payload.name+"()")

    }, */

    changeTone({rootstate},payload) {
      console.log("rootstate", rootstate);
      let { name, val} = payload;
      switch(name) {
        case "reverb": {
          changeReverb(val)
          break;
        }
        case "bpm": {
          changeBpm(val)
          break;
        }
      }
    },
    async setMidiOutputFromCache() {
      let cachedMidiOutput = await getMidiOutputFromLocalStorage()
      
      if(cachedMidiOutput) {
        setOutputDevice(cachedMidiOutput);
      }
    }
  },
  getters: {
    findArrowRefIndex: state => refName => {

      let index = state.arrowRefs.findIndex(ref => ref.refName == refName);
      return index;
    },
    findArrowRef: state => refName => {
      let arrowRef = state.arrowRefs.filter(ref => ref.refName == refName);
      return arrowRef[0];
    },
    getArrowRefs: state => {
      return state.arrowRefs;
    },
    getPlayingDiv: state => {
      return state.playingDiv;
    },
    getGridSize: state => {
      return state.gridSize;
    },
    getArpeggio: state => {
      return state.arpeggio
    },
    midiOutActive: state => {
      return state.midiOutActive
    }
  },
  modules: {}
});
