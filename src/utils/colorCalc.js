/* const colorStyling = function(x, y) {
      switch (this.styling) {
        case "80s":
          return {
            background: this.colorCalcDifference(x, y),
            "box-shadow": `-5px -5px 10px ${this.colorCalcDifference(y, x)} `
          };
        case "classic": {
          let backgroundColors = {
            background: this.colorCalcDifBoth(x, y)
          };
          return backgroundColors;
        }
      }
    }, */
 /*    colorCalcDifference(x, y) {
      let xArr = [x, highlightPos.x];
      let yArr = [y, highlightPos.y];
      xArr.sort((a, b) => b - a);
      yArr.sort((a, b) => b - a);
      let subtractorX = xArr[0] - xArr[1];

      let growedSubtractorX = subtractorX * 18;
      let subtractorY = yArr[0] - yArr[1];
      let growedSubtractorY = subtractorY * 18;

      let red = 200 - growedSubtractorX;
      let green = 200 - growedSubtractorY;
      return "rgb(" + green + "," + red + ",250)";
    } */

    import store  from '../store/index'
    


    let isPlaying = store.state.isPlaying;
    let gridSize = store.getters.getGridSize;
    let highlightPos = { x:10, y: 10}

    
   const colorStyling = function(x, y, getHighlightPos, property ) {

          highlightPos = getHighlightPos;
          let colors = {};
          colors[property] = colorCalcDifBoth(x, y);
          return colors;
        };
    const colorCalcDifBoth = function (x, y) {
      if (
        isPlaying &
        (x === highlightPos.x) &
        (y === highlightPos.y)
      ) {
        return "white";
      }
      return (
        "rgb(" +
        colorCalcDif(y, "y") +
        "," +
        colorCalcDif(x, "x") +
        ",250)"
      );
    };

    const colorCalcDif = function(n, coordinate) {
      let pos = highlightPos[coordinate];
      let availableDistance = gridSize[coordinate] - 1;

      let numbers = [n, pos];
      numbers.sort((a, b) => b - a);
      let high = numbers[0];
      let low = numbers[1];
      let difference = high - low;
      let percentageAway = difference / availableDistance;

      let invert = 250 * percentageAway;
      return 250 - invert;
    };
      
export { colorStyling }