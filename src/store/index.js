import Vue from "vue";
import Vuex from "vuex";
import { createAllArpeggios } from "../utils/pitchCalculations";
import { changeBpm, changeReverb } from "../playStuff/playStuff"
import { setInCache } from "../utils/cacheMethods"


Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    isPlaying: false,
    playingDiv: null,
    backgroundColors: "",
    transformedSquares: [],
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
    midiOutActive: false,
    modalIsOpen: false,
    joystickMode: false,
    portalCreatorActive: false,
    openPortal: null,
    colorTheme: "classic",
    selectedWaveform: "sawtooth",
    intialVolume: 8

  },
  mutations: {

    setSelectedWaveform(state, payload) {
      state.selectedWaveform = payload
    },
    toggleArrowAndPortal(state) {
      state.portalCreatorActive = !state.portalCreatorActive
    },
    setAllCachedInfo(state, cachedInfo) {

      Object.keys(cachedInfo).forEach(key => { 
        if(cachedInfo[key]) {
          state[key] = cachedInfo[key] }
          }
        );
      },
    setColorTheme(state, colorTheme) {
      state.colorTheme = colorTheme;
      setInCache(state.colorTheme, 'colorTheme');
    },

    toggleJoystickMode(state) {
      state.joystickMode = !state.joystickMode;
      setInCache(state.joystickMode, 'joystickMode')
    },
    changeIsPlayingState(state, payload) {
      state.isPlaying = payload;
    },
    changePlayingDiv(state, payload) {
      state.playingDiv = payload;
    },

    addArrow(state, payload) {
      state.transformedSquares.push(payload);
      setInCache(state.transformedSquares, 'transformedSquares');
    },
    updateTransformedSquaresAfterGridChange(state, payload) {
      state.transformedSquares = payload;
      setInCache(state.transformedSquares, 'transformedSquares');


    },
    bulkAddTransformedSquares( state, payload){
      state.transformedSquares = payload;
      setInCache(state.transformedSquares, 'transformedSquares')
    },
    removePortal(state, payload) {
      let newTransformedSquaresState = state.transformedSquares;
      const { connectsTo, refName } = payload;
      if(connectsTo) {
        newTransformedSquaresState = newTransformedSquaresState.filter(square => square.refName !== connectsTo);
      }
       newTransformedSquaresState = newTransformedSquaresState.filter(square => square.refName !== refName);
      state.openPortal = "";
      
      state.transformedSquares = newTransformedSquaresState;
      setInCache(newTransformedSquaresState, 'transformedSquares')
    },
    removeTransformedSquare(state, arrow) {

        const {refName} = arrow;
        let index = this.getters.findTransformedSquareIndex(refName);

      if (index !== -1) {

        let newState = state.transformedSquares.filter(square => square.refName !== refName);
        state.transformedSquares = newState;
        setInCache(state.transformedSquares, 'transformedSquares');
      }
    },

    clearGrid(state) {
      state.transformedSquares = [];
      setInCache(state.transformedSquares, 'transformedSquares');
    },
    changeDirectionOnArrowRef(state, payload) {
      let { index, direction } = payload;
      state.transformedSquares[index].direction = direction;
      setInCache(state.transformedSquares, 'arrowRefs');
    },
/*     setDirection(state, payload) {
      state.direction = payload;
    }, */
    setGridSize(state, payload) {
     let newGridSize = {}
     let { x, y } = payload;
     newGridSize.x = x? x : state.gridSize.x;
     newGridSize.y = y? y : state.gridSize.y;
     state.isPlaying = false;
     state.gridSize = newGridSize
     setInCache(state.gridSize, 'gridSize');

    },
    setArpeggio(state, payload) {
      state.arpeggio = payload;
      setInCache(payload, 'arpeggio');
      
    },
      isMobile(state) {
      state.isMobile = true;
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
        setInCache(state.midiOutActive, "midiOutActive");

      },
      changePortalCreatorActive(state, bool){
        state.portalCreatorActive = bool;
      },
      addPortal(state,payload) {
        if(state.openPortal) {

          let { openPortal } = state;
          state.transformedSquares.push({ ...payload, connectsTo: openPortal.refName, type: 'Portal' });
          let indexOfConnection = state.transformedSquares.findIndex(square => square.refName == openPortal.refName);
          state.transformedSquares[indexOfConnection].connectsTo = payload.refName;
          state.openPortal = null;
          setInCache(state.transformedSquares, 'transformedSquares')
          return
        }
        state.transformedSquares.push({...payload, type: 'Portal'});
        state.openPortal = payload;
      },
      addPause(state, payload) {
        state.transformedSquares.push(payload);
        setInCache(state.transformedSquares, 'transformedSquares');
      }

},
  actions: {
    togglePause({commit}, refForSquare) {
    },
    setSelectedWaveform({commit},payload) {
      commit("setSelectedWaveform", payload)
    },
    toggleArrowAndPortal({commit}) {
      commit("toggleArrowAndPortal");
    },
    setAllCachedInfo({commit}, cachedInfo) {

      commit('setAllCachedInfo', cachedInfo);
    },
/*     addMidiOutActive() {

    }, */
    setColorTheme({commit}, colorTheme) {

      commit("setColorTheme", colorTheme)
      
    },


    toggleJoystickMode({commit}) {
      commit('toggleJoystickMode');
    },
    clearGrid( { commit }) {
      commit('clearGrid');
    },

    modalIsOpen({ commit }, payload) {

      commit("setModal", payload);

    },
    changeIsPlayingState({ commit }, payload) {
      commit("changeIsPlayingState", payload);
    },
    setPlayingDiv({ commit }, payload) {
      commit("changePlayingDiv", payload);
    },


    addArrowRef({ commit, getters }, payload) {
      let { x, y, direction, refName } = payload;

      let indexOfDuplicate = getters.findTransformedSquareIndex(refName);

      if (indexOfDuplicate !== -1) {
        commit("changeDirectionOnArrowRef", {
          index: indexOfDuplicate,
          direction
        });
        return;
      }
      commit("addArrowRef", { x, y, refName, direction, type: "arrow" });
    },
    removeTransformedSquare({ commit }, payload) {
      if(payload.type === 'Portal') {
        commit('removePortal', payload);
      }
      else {
        commit('removeTransformedSquare', payload);
      }
    },
    addTransformedSquare({ commit }, payload) {
      commit(`add${payload.type}`, payload );
    },

    changeGridSize({commit, dispatch}, payload) {
      commit("changeIsPlayingState",false);
      commit("setGridSize", payload);
      dispatch("setAllArpeggios");
      dispatch("updateTransformedSquaresAfterGridChange");

    },
    changeArpeggio({commit,dispatch}, payload) {
      commit("setArpeggio", payload);
      dispatch("setAllArpeggios");

    },
    bulkAddTransformedSquares({commit, dispatch}, payload) {
      commit("bulkAddTransformedSquares", payload);

      dispatch("updateTransformedSquaresAfterGridChange");
    },
    updateTransformedSquaresAfterGridChange({commit, state}) {
      let { x, y } = state.gridSize;
      let availableTransformedSquares = state.transformedSquares.filter( square => square.x <= x && square.y <= y );
      commit("updateTransformedSquaresAfterGridChange",availableTransformedSquares );
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

    },


    changeTone({rootstate},payload) {
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

    changePortalCreatorActive({ commit },bool) {
     commit("changePortalCreatorActive",bool);
    },

  },
  getters: {
    getColorCenter: state => {
      return state.playingDiv
        ? state.playingDiv
        : { x: 10, y: 10, refName: "r10,10" };
    },
    getSelectedWaveform: state => state.selectedWaveform,
    getPortalCreatorActive: state => state.portalCreatorActive,
    getJoystickMode: state => {
      return state.joystickMode;
    },
    getStartingArrow: state => {
      return state.transformedSquares.find(square => square.direction);
    },
    findTransformedSquareIndex: state => refName => {
      let index = state.transformedSquares.findIndex(square => square.refName == refName);
      return index;
    },
    findTransformedSquare: state => refName => {
      let transformedSquare = state.transformedSquares.filter(ref => ref.refName == refName);
      return transformedSquare[0];
    },
/*     getArrowRefDirection: state => refName => {
      let index = state.arrowRefs.findIndex(ref => ref.refName == refName);
      if(index !== -1) {
        let direction = state.arrowRefs[index].direction;
        return { direction, index}
      }
      else {
        return null
      }
    }, */


    getPortalNumber: state => refName => {
    let arrayOfPortals = state.transformedSquares.filter(square => square.type === 'Portal');
    let index = arrayOfPortals.findIndex(square => square.refName === refName);
    let portalNumber = Math.round((index+1)/2);
    return portalNumber;
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
    },
    getColorTheme: state => {
      return state.colorTheme;
    }
  },
  modules: {}
});
