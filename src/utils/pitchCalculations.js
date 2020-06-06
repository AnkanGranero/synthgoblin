const createAllArpeggios = function(arpeggio ,gridSize, angle) {
      let allArrs = [];
      let startKey = 0;
        if(!gridSize) {
            return
        }
  
      for (let i = 0; i <= gridSize.x; i++) {
        let arr = createPitchArr(startKey, arpeggio, gridSize,angle, i);
        allArrs.push(arr);
        let interval = parseInt(arpeggio[i % arpeggio.length], 10);
        startKey += interval;
      }
   



      return allArrs
    }

    const createPitchArr = function(startKey, arpeggio, gridSize, angle, index) {
      let arr = [];
      let pianoKey = startKey;
      let scaleDegree = index

      if(angle === "symetric") {
      for (let i = 0; i <= gridSize.y; i++) {
        arr.push(hertzCalculator(pianoKey));
        let interval = parseInt(arpeggio[i % arpeggio.length], 10);
        pianoKey += interval;
      }}
      if(angle === "diatonic") {
      for (let i = 0; i <= gridSize.y; i++) {
        arr.push(hertzCalculator(pianoKey));
        let interval = parseInt(arpeggio[scaleDegree % arpeggio.length], 10);
        pianoKey += interval; 
        scaleDegree++
      }}
      return arr;
    }
    const hertzCalculator = function(n) {
      return Math.pow(2, n / 12) * 55;
    }

export {

    createAllArpeggios
}