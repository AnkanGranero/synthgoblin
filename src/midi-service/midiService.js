import WebMidi from "webmidi";

let bpm = 150;
let noteLength = 0.8;

let noteDuration = noteLength * 60000 / bpm;

let midiOutput = null;

let midiOutputs = new Promise((resolve, reject) => {
  WebMidi.enable((err) => {
    if(err) return reject(err);

    resolve(WebMidi.outputs);
  });
});

function updateNoteDuration() {
  noteDuration = noteLength * 60000 / bpm;
}

const changeMidiBpm = (newBpm) => {
  bpm = newBpm;
  updateNoteDuration();
}

const changeMidiNoteLength = (newNoteLength) => {
  noteLength = newNoteLength;
  updateNoteDuration();
}

const setOutputDevice = (newOutputDevice) => {
  midiOutput = newOutputDevice;
}

const midiPlay = (note) => {
  if(!midiOutput) return;

  let midiNote = (Math.log(note / 440.0) / Math.log(2)) * 12 + 69;

  midiOutput.playNote(midiNote, "all", { duration : noteDuration });
}

const midiStop = () => {
  if(!midiOutput) return;

  midiOutput.stopNote("all");
}

const getMidiOutputFromLocalStorage = async function() {
  let outputs = await midiOutputs;
  let matches = outputs.filter(output => output.name === localStorage.midiOutput)

  if(!matches[0]){
    console.log("no matching midiOutput in localStorage");
  }

  return matches[0];
}

export {
    changeMidiBpm,
    changeMidiNoteLength,
    setOutputDevice,
    midiPlay,
    midiStop,
    midiOutputs,
    getMidiOutputFromLocalStorage
};

