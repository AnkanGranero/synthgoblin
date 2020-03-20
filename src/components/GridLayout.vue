//jag har en array med den spelande koordinaterna, som när den ersätts 
först tar bort styling till den första sen lägger till till den nya
<template>
  <div class="pageWrapper">
    <div v-for="y in 15" :key="y" :class="createGridClass(y)">
      <div
        v-for="x in 15"
        :key="x"
        @mouseover="mouseEventHandler(x, y)"
        :style="colorStyling(x,y)"
        class="button-wrapper"
        :ref="'r'+x+y"
      >
        <square @clicked="handleClick" :refForSquare="refForSquare(x,y)"></square>
      </div>
    </div>
  </div>
</template>


<script>
import square from "./Square";
import * as Tone from "tone";

let synth = new Tone.Synth({
  oscillator: {
    type: "square",
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
  }
}).toMaster();

export default {
  name: "GridLayout",
  components: {
    square
  },
  data() {
    return {
      mousePos: { x: 3, y: 19 },
      arrowRef: [],
      arrowRefs: [],
      index: 0,
      playingDiv: { x: 10, y: 10 },
      lydianScale: [1, 2, 2, 2, 1, 2, 2],
      allScales: [],
      direction: ""
    };
  },
  mounted() {
    this.createAllPitchArrs();
  },
  methods: {
    refForSquare(x, y) {
      const refName = `r${x}${y}`;
      return {
        x,
        y,
        refName
      };
    },
    createAllPitchArrs() {
      let allArrs = [];
      let startKey = 0;

      for (let i = 0; i <= 15; i++) {
        let arr = this.createPitchArr(startKey);
        allArrs.push(arr);
        startKey += this.lydianScale[i % 7];
      }
      this.allScales = allArrs;
    },
    createPitchArr(startKey) {
      let arr = [];
      let pianoKey = startKey;
      for (let i = 0; i <= 15; i++) {
        arr.push(this.hertzCalculator(pianoKey));
        pianoKey += this.lydianScale[i % 7];
      }
      return arr;
    },
    hertzCalculator(n) {
      return Math.pow(2, n / 12) * 440;
    },
    getRefFromCoordinates(x, y) {
      return `r${x}${y}`;
    },

    colorStyling(x, y) {
      return {
        background: this.colorCalcDifference(x, y),
        border: `1px solid ${this.colorCalcDifference(y, x)}`,
        "box-shadow": `-10px -10px 8px ${this.colorCalcDifference(y, x)} `
      };

      /* {
        background:
          "rgb(" + this.colorCalcY(y) + "," + this.colorCalcX(x) + ",250)"
      }; */
    },
    findInArr(x, y) {
      let findInArr = this.arrowRef.find(item => item.x === x && item.y === y);

      return findInArr ? this.arrowRefs.indexOf(findInArr) : null;
    },
    findArrowRef(x, y) {
      let refName = this.getRefFromCoordinates(x, y);
      return this.arrowRefs.find(arrowRef => arrowRef.name === refName);
    },
    loop() {
      Tone.Transport.scheduleRepeat(this.repeat, "8n");
      Tone.Transport.start();
    },
    nextCoordinateBasedOnDirection(x, y, direction) {
      switch (direction) {
        case "down":
          y += 1;
          break;
        case "right":
          x += 1;
          break;
        case "left":
          x -= 1;
          break;
        case "up":
          y -= 1;
          break;
      }

      return { x, y, direction };
    },

    repeat(time) {
      let { playingDiv } = this;

      let { x, y, refName, direction } = playingDiv;

      let ref = this.$refs[refName];
      ref[0].classList.remove("highlight");

      if (this.isArrowRef(x, y)) {
        direction = this.findArrowRef(x, y).direction;
      }

      let note = this.allScales[x][y];

      synth.triggerAttackRelease(note, "8n", time);

      let nextCoordinates = this.nextCoordinateBasedOnDirection(
        x,
        y,
        direction
      );

      let nextPlayingDivRef = this.getRefFromCoordinates(
        nextCoordinates.x,
        nextCoordinates.y
      );
      this.playingDiv = { ...nextCoordinates, refName: nextPlayingDivRef };
      let nextPlayingDiv = this.$refs[nextPlayingDivRef];

      nextPlayingDiv[0].classList.add("highlight");
    },
    refFinder(x, y) {
      return this.$refs["r" + x + y];
    },

    addArrowRef(payload) {
      console.log("payload", payload);

      let { x, y, direction, refName } = payload;

      this.arrowRefs.push({ x, y, name: refName, direction: direction });
    },

    handleClick(payload) {
      this.addArrowRef(payload);
      if (payload.status == "play") {
        this.playingDiv = payload;

        this.loop();
      }
    },
    isArrow(x, y) {
      let answer = this.arrowRefs.find(item => item.x === x && item.y === y);
      return answer ? true : false;
    },
    isArrowRef(x, y) {
      let refname = this.getRefFromCoordinates(x, y);
      let arrowRef = this.arrowRefs.find(arrowRef => arrowRef.name === refname);
      return arrowRef ? true : false;
    },
    mouseEventHandler(x, y) {
      this.colorCalcXY(x, y);
      this.mousePos = { x, y };
    },
    createGridClass(n) {
      return `row row-${n}`;
    },
    colorCalcY(n) {
      let subtract = n - (this.mousePos.y - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcX(n) {
      let subtract = n - (this.mousePos.x - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcXY(x, y) {
      let numbers = [x, y];
      console.log("numbers först", x, y);

      numbers.sort((a, b) => a - b);
      let highest = numbers[0];
      let lowest = numbers[1];
      let add = highest + this.mousePos[highest];
      let subtract = lowest - (this.mousePos[lowest] - 1);

      numbers[highest] = add;
      numbers[lowest] = subtract;

      console.log("numbers igen", x, y);
    },
    colorCalcDifference(x, y) {
      let xArr = [x, this.playingDiv.x];
      let yArr = [y, this.playingDiv.y];
      xArr.sort((a, b) => b - a);
      yArr.sort((a, b) => b - a);
      let subtractorX = xArr[0] - xArr[1];
      console.log("xarr", xArr[0], xArr[1]);

      let growedSubtractorX = subtractorX * 18;
      let subtractorY = yArr[0] - yArr[1];
      let growedSubtractorY = subtractorY * 18;
      console.log("subtractor", growedSubtractorY, growedSubtractorX);

      let red = 200 - growedSubtractorX;
      let green = 200 - growedSubtractorY;
      return "rgb(" + green + "," + red + ",250)";
    }
  }
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.pageWrapper {
  height: 80vh;
  /*   width: 50%; */
  display: grid;
  grid-template-rows: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}
.button-wrapper {
}

.row {
  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.highlight {
  border: 5px solid green;
}
</style>