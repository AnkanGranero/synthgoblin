<template>
  <div class="pageWrapper">
    <div v-for="y in 15" :key="y" :class="createGridClass(y)">
      <div
        v-for="x in 15"
        :key="x"
        :style="colorStyling(x,y)"
        @mousedown="mouseEventHandler(x, y)"
        @mouseup="mouseEventHandler(x, y)"
        @mouseover="mouseEventHandler(x, y)"
        @contextmenu.prevent="highlightToggle(x, y)"
        class="button-wrapper"
        :ref="'r'+ x +y"
      >
        <button class="up"></button>
        <div class="center">
          <button class="left"></button>
          <button class="center">
            <img
              src="../assets/arrow.png"
              v-if="findArrowRef(x,y) || findArrowRef(x,y)=== 0"
              alt="arrow"
              :style="whatDirection(x,y)"
              @click="handleClick(x,y)"
            />
          </button>
          <button class="right"></button>
        </div>
        <button class="down"></button>
      </div>
    </div>
  </div>
</template>


<script>
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
  data() {
    return {
      mousePos: { x: 0, y: 0 },
      highLightedDivs: [],
      arrowRefs: [],
      index: 0,
      playingArrow: {},
      lydianScale: [1, 2, 2, 2, 1, 2, 2],
      allScales: [],
      direction: ""
    };
  },
  mounted() {
    this.createAllPitchArrs();
  },
  methods: {
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
      let isHighLighted = this.isHighligthed(x, y);
      if (!isHighLighted) {
        return {
          background:
            "rgb(" + this.colorCalcY(y) + "," + this.colorCalcX(x) + ",250)"
        };
      } else {
        return { background: "black" };
      }
    },
    findInArr(x, y) {
      let findInArr = this.highLightedDivs.find(
        item => item.x === x && item.y === y
      );

      return findInArr ? this.highLightedDivs.indexOf(findInArr) : null;
    },
    findArrowRef(x, y) {
      let refName = this.getRefFromCoordinates(x, y);
      return this.arrowRefs.find(arrowRef => arrowRef.name === refName);
    },
    loop() {
      Tone.Transport.scheduleRepeat(this.repeat, "8n");
      Tone.Transport.start();
    },
    nextCoordinateBasedOnDirection(x, y, direction, index) {
      switch (direction) {
        case "down":
          y += index;
          break;
        case "right":
          x += index;
          break;
        case "left":
          x -= index;
          break;
        case "up":
          y -= index;
          break;
      }

      return { x, y };
    },

    repeat(time) {
      let { playingArrow, index } = this;

      let { x, y } = playingArrow;
      let direction = playingArrow.direction;
      let nextCoordinates = this.nextCoordinateBasedOnDirection(
        x,
        y,
        direction,
        index
      );

      x = nextCoordinates.x;
      y = nextCoordinates.y;

      let refName = this.getRefFromCoordinates(x, y);
      let ref = this.$refs[refName];
      ref[0].classList.add("highlight");

      if (this.isArrowRef(x, y)) {
        this.playingArrow = this.findArrowRef(x, y);

        this.index = 0;
      }

      let note = this.allScales[x][y];

      synth.triggerAttackRelease(note, "8n", time);
      this.index++;
    },
    refFinder(x, y) {
      return this.$refs["r" + x + y];
    },
    whatDirection(x, y) {
      /*  let index = this.findInArr(x, y);
      let arr = this.highLightedDivs[index]; */
      let { direction } = this.findArrowRef(x, y);
      let degrees;
      switch (direction) {
        case "left":
          degrees = "180deg";
          break;
        case "right":
          degrees = "0deg";
          break;
        case "up":
          degrees = "-90deg";
          break;
        case "down":
          degrees = "90deg";
          break;
      }
      return [{ transform: `rotate(${degrees})` }];
    },
    highlightToggle(x, y) {
      let refName = this.getRefFromCoordinates(x, y);
      let direction = event.toElement.classList.value;
      if (direction == "button-wrapper") {
        console.log("button-wrapper");
        direction = "down";
      }
      let ref = this.$refs[refName];

      ref[0].classList.add("arrow");

      if (this.isArrowRef(x, y)) {
        let foundRef = this.arrowRefs.find(arrow => arrow.name === refName);
        foundRef.direction = direction;
      } else {
        this.arrowRefs.push({ x, y, name: refName, direction: direction });
      }
    },

    handleClick(x, y) {
      this.playingArrow = this.findArrowRef(x, y);
      this.loop();
    },
    isHighligthed(x, y) {
      let answer = this.highLightedDivs.find(
        item => item.x === x && item.y === y
      );
      return answer ? true : false;
    },
    isArrowRef(x, y) {
      let refname = this.getRefFromCoordinates(x, y);
      let arrowRef = this.arrowRefs.find(arrowRef => arrowRef.name === refname);
      return arrowRef ? true : false;
    },
    mouseEventHandler(x, y) {
      this.$emit("mouseEvent", { x, y, event: event.type });
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
    }
  }
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.pageWrapper {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.row {
  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.button-wrapper {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 0;
  button {
    outline: none;
    background: none;
    height: 100%;
    width: 100%;
    border: none;
    z-index: 2;
    img {
      height: 20px;
    }
  }
  .up,
  .down {
    width: 80%;
    align-self: center;
  }

  .center {
    display: flex;
    justify-content: space-between;
    height: 100%;

    img:hover {
      height: 2rem;
    }
  }
}
.arrow {
  border: 5px solid white;
}
.highlight {
  border: 5px solid green;
}
</style>