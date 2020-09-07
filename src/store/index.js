import Vue from "vue";
import Vuex from "vuex";
import { getMidiOutputFromLocalStorage, setOutputDevice } from "../midi-service/midiService"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isPlaying: false,
    playingDiv: null,
    backgroundColors: "",
    arrowRefs: [],
    direction: "",
    gridSize: {
      coordinates: { 
        x: 15,
        y: 15
      },
      maxValue: 25
    
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
      
      state.isPlaying = false;
      state.gridSize.coordinates = payload
    },
    setArpeggio(state, payload) {
        
      state.arpeggio = payload
      
    },
      isMobile(state) {
      state.isMobile = true;
      },
      setGridMaxValue(state, payload) {
      state.gridSize.maxValue = payload
      },
      setAllArpeggios(state,payload) {
        state.allArpeggios = payload
      },
      setAngle(state, payload) {
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
    changeGridSize({commit}, payload) {
      commit("changeIsPlayingState",false);
      commit("setGridSize", payload);
    },
    changeArpeggio({commit}, payload) {
      
      commit("setArpeggio", payload)
    },
    changeGridMaxValue({commit}, payload) {
        commit("setGridMaxValue", Number(payload))
    },
    createAllArpeggios({commit}, payload) {
      commit("setAllArpeggios", payload)
    },
    changeAngle({commit}, payload) {
      commit("setAngle", payload)
    },
    addMidiOutput({commit}, payload) {
      commit("setMidiOutput", payload)
    },
    toggleMidiOutActive({commit, dispatch}) {
      commit("toggleMidiOutActive");
      dispatch("setMidiOutputFromCache");
    },
    async setMidiOutputFromCache() {
      let cachedMidiOutput = await getMidiOutputFromLocalStorage()
      
      if(cachedMidiOutput) {
        //maybe this isnt nessasary to keep in state
/*         commit("setMidiOutput", cachedMidiOutput); */

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
      return state.gridSize.coordinates;
    },
    getArpeggio: state => {
      return state.arpeggio
    },
/*     getMidiOutput: state => {
      return state.midiOutput
    }, */
    midiOutActive: state => {
      return state.midiOutActive
    }
  },
  modules: {}
});
