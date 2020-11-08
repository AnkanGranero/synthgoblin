/* import store from "../store/index" */

import * as Tone from "tone"; 
import { setInCache, getCachedToneInfo } from "../utils/cacheMethods";
/* 
let midiOutput = store.getters.getMidiOutput; */


let tempoInBpm = 150;



const reverb = new Tone.Reverb({
  decay: 5,
  wet: 0.3,
  preDelay: 0.2
}).toMaster();
var filter = new Tone.Filter({
  type: "bandpass",
  Q: 120
}).toMaster();
const synth = new Tone.Synth({
  oscillator: {
    type: "sawtooth",
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
  }
});

    async function preparePlayStuff() {
      await reverb.generate();

      synth.connect(reverb);
      synth.connect(filter);
    }
const playThang = function(repeat) {

    Tone.Transport.bpm.value = tempoInBpm;
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat(repeat, "16n");
}

const stopPlaying = function() {
    Tone.Transport.cancel();
}

const changeBpm = function(val) {
tempoInBpm = val;
setInCache(val, "bpm");
Tone.Transport.bpm.value = val;
}
const changeReverb = function(val) {
reverb.wet.value = val;
setInCache(val, "reverbValue");
}

  const changeWave = function(val) {
      synth.oscillator.type = val;
      setInCache( val, "waveform")
    }
const changeVolume = function(val) {
  let transformedValue = -20 + (val * 2);
  synth.volume.value = transformedValue;
  setInCache(transformedValue,"volume");
} 

const changeMuteState = function(bool) {
  let value = bool? -150: 0;
  synth.volume.value = value;
}
const setToneValuesFromCache = function () {
  const cachedInfo = getCachedToneInfo();
  let { bpm, reverbValue, volume, waveform} = cachedInfo;
  if(bpm) tempoInBpm = bpm;
  if(reverbValue) {
  reverb.wet.value = reverbValue};
    
  if(volume) synth.volume.value = volume;
  if(waveform) {
    changeWave(waveform);
  } 
}

setToneValuesFromCache();

export {playThang, changeBpm, changeReverb, stopPlaying, preparePlayStuff,changeWave, synth, changeMuteState, changeVolume, setToneValuesFromCache, tempoInBpm, reverb, Tone}