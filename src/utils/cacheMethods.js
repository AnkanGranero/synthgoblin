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

    return { gridSize, arpeggio, arrowRefs, portals, colorTheme, joystickMode }

}
function getCachedToneInfo() {
      const bpm = getCachedInfo('bpm');
      const volume = getCachedInfo('volume');
      const reverbValue = getCachedInfo('reverbValue');

return { bpm, volume, reverbValue};
}

export { setInCache, getCachedInfo, getAllCachedInfo, getCachedToneInfo}