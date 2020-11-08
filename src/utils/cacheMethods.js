 function setInCache(value, name) {
      let parsedValue = JSON.stringify(value);
      localStorage.setItem(name,parsedValue)
}
function getCachedInfo(name) {
      let cachedInfo = localStorage.getItem(name);
      return cachedInfo? JSON.parse(cachedInfo) : ""
    
}

function getAllCachedInfo() {
    const gridSize = getCachedInfo('gridSize');
    const arpeggio = getCachedInfo('arpeggio');
    const arrowRefs = getCachedInfo("arrowRefs");
    const portals = getCachedInfo("portals");
    const colorTheme = getCachedInfo("colorTheme");
    const joystickMode = getCachedInfo("joystickMode");
    const midiOutActive = getCachedInfo("midiOutActive");
    const waveform = getCachedInfo("waveform");
    

    return { gridSize, arpeggio, arrowRefs, portals, colorTheme, joystickMode, midiOutActive, waveform }

}
function getCachedToneInfo() {
      const bpm = getCachedInfo('bpm');
      const volume = getCachedInfo('volume');
      const reverbValue = getCachedInfo('reverbValue');
      const waveform = getCachedInfo("waveform");

return { bpm, volume, reverbValue, waveform
};
}

export { setInCache, getCachedInfo, getAllCachedInfo, getCachedToneInfo}