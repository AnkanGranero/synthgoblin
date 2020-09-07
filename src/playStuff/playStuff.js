/* import store from "../store/index" */
import * as Tone from "tone"; 
/* 
let midiOutput = store.getters.getMidiOutput; */


let bpm = 150;


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

    async function prepare() {
      await reverb.generate();

      synth.connect(reverb);
      synth.connect(filter);
    }
prepare()
const playThang = function(repeat) {

    Tone.Transport.bpm.value = bpm;
    Tone.Transport.start();
   /*  midiOutput.send([0x80, 0x3c, 0x74]); */
    Tone.Transport.scheduleRepeat(repeat, "16n");
}

const stopPlaying = function() {
    Tone.Transport.cancel();
}

const changeBpm = function(val) {
bpm = val;
Tone.Transport.bpm.value = val;
}
const changeReverb = function(val) {
reverb.wet.value = val;
}


/* const stop = function() {
    store.actions
} */

export {playThang, changeBpm, changeReverb, stopPlaying}