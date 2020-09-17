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

    return { gridSize, arpeggio, arrowRefs }

}

export { setInCache, getCachedInfo, getAllCachedInfo}