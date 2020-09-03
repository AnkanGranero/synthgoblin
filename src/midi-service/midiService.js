    let lastMidiNote = "";
    let noteOn = 0x90
    let noteOff = 0x80
    const midiPlay = (midiOutput, midiNote) => {

            midiStop(midiOutput);

            midiOutput.send([noteOn, midiNote, 0x74])
            lastMidiNote = midiNote
  
    }
    const midiStop = (midiOutput)  => {
        if(lastMidiNote) {
            midiOutput.send([noteOff, lastMidiNote, 0x74 ])

        }
    }
    const requestMIDIAccess = () => {
      return window.navigator.requestMIDIAccess().then(function(midiAccess) {
        return Array.from(midiAccess.outputs.values());
      });
    }
    const  getMidiOutputFromLocalStorage = async function() {

      return await requestMIDIAccess()
        .then( resp => resp.filter(output => output.name === localStorage.midiOutput))
        .catch(() => {
        console.log("no matching midiOutput in localStorage");
        })
    
    }

    export { midiPlay, midiStop, requestMIDIAccess, getMidiOutputFromLocalStorage}