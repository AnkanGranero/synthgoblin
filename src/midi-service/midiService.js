import WebMidi from "webmidi";

let bpm = 150;
let noteLength = 0.8;


/* let velocity = 0.9; */

let outputChannel = 1;
let midiOutput = null;

let midiValues = {
  velocity : 0.9,
  noteLength: 0.8
}

let duration = midiValues[noteLength] * 60000 / bpm;

let midiOutputs = new Promise((resolve, reject) => {
  WebMidi.enable((err) => {
    if(err) return reject(err);

    resolve(WebMidi.outputs);
  });
});

function updateNoteDuration() {
  duration = noteLength * 60000 / bpm;
}

const changeMidiBpm = (newBpm) => {
  bpm = newBpm;
  updateNoteDuration();
}

const changeMidiValue = (payload) => {
  const { name, val} = payload;
midiValues[name] = val;
updateNoteDuration();
}

const changeMidiNoteLength = (newNoteLength) => {
  noteLength = newNoteLength;
  updateNoteDuration();
}

/* const changeMidiVelocity = (newVelocity) => {
  velocity = newVelocity;
} */

const setOutputDevice = (newOutputDevice) => {
  midiOutput = newOutputDevice;
}

const setOutputChannel = (newOutputChannel) => {
  outputChannel = newOutputChannel;
}

const midiPlay = (note) => {
  if(!midiOutput) return;

  let midiNote = (Math.log(note / 440.0) / Math.log(2)) * 12 + 69;
  const { velocity } = midiValues;
  midiOutput.playNote(midiNote, outputChannel, { duration, velocity });
}

const midiStop = () => {
  if(!midiOutput) return;

  midiOutput.stopNote("all");
}

const getMidiOutputFromLocalStorage = async function() {
  let outputs = await midiOutputs;
  let matches = outputs.filter(output => output.name === localStorage.midiOutput)

  // if(!matches[0]){
  //   console.log("no matching midiOutput in localStorage");
  // }

  return matches[0];
}

export {

    changeMidiBpm,
/*     changeMidiVelocity, */
    changeMidiNoteLength,
    setOutputDevice,
    setOutputChannel,
    midiPlay,
    midiStop,
    midiOutputs,
    outputChannel,
    getMidiOutputFromLocalStorage,
    changeMidiValue
};

