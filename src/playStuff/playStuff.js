/* import store from "../store/index" */

import * as Tone from "tone"; 
import { setInCache, getCachedToneInfo } from "../utils/cacheMethods";
/* 
let midiOutput = store.getters.getMidiOutput; */


let tempoInBpm = 150;
let volumeDb = 0;
let isMuted = false;




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

// Browsers (iOS Safari in particular) keep the AudioContext suspended until
// it is resumed from inside a user gesture, so call this from tap/click/key handlers.
const unlockAudio = function() {
  // iOS 17+: play through the media channel so the silent switch doesn't mute us
  if (navigator.audioSession) navigator.audioSession.type = "playback";
  if (Tone.context.state !== "running") Tone.start();
}
const playThang = function(repeat) {

    Tone.Transport.bpm.value = tempoInBpm;
    Tone.Transport.start();
    Tone.Transport.scheduleRepeat(repeat, "16n");
}

const stopPlaying = function() {
    Tone.Transport.cancel();
    Tone.Transport.stop();
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
  let transformedValue;


  if(val > 0) {
    transformedValue = val - 10;
  }
  else {
    transformedValue = -100
  }
  volumeDb = transformedValue * 4
  if(!isMuted) synth.volume.value = volumeDb;
  setInCache(val,"volume");
}

const changeMuteState = function(bool) {
  isMuted = bool;
  synth.volume.value = bool? -150: volumeDb;
}
const setToneValuesFromCache = function () {
  const cachedInfo = getCachedToneInfo();
  let { bpm, reverbValue, volume, waveform} = cachedInfo;
  if(bpm) tempoInBpm = bpm;
  if(reverbValue) {
  reverb.wet.value = reverbValue};
    
  if(waveform) {
    changeWave(waveform);
  } 
}


setToneValuesFromCache();

export {playThang, unlockAudio,changeBpm, changeReverb, stopPlaying, preparePlayStuff,changeWave, synth, changeMuteState, changeVolume, setToneValuesFromCache, tempoInBpm, reverb, Tone}