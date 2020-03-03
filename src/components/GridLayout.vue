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
              v-if="findInArr(x,y) || findInArr(x,y)=== 0"
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
      selectedRef: {},
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
    refMaker(x, y) {
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
    findArrowRef(ref) {
      return this.arrowRefs.find(arrowRef => arrowRef.name === ref);
    },
    loop() {
      Tone.Transport.scheduleRepeat(this.repeat, "8n");
      Tone.Transport.start();
    },
    repeat(time) {
      let { selectedRef, index } = this;
      let { x, y } = selectedRef;
      let refName = this.refMaker(x, y + index);
      let ref = this.$refs[refName];

      if (this.isArrowRef(refName)) {
        let arrowRef = this.findArrowRef(ref);
        let direction = arrowRef.direction;
        console.log("arrowRef", arrowRef, direction);
      }
      //behövs refFinder?
      let note = this.allScales[x][y + index];
      let input = this.refFinder(x + index, y);
      console.log(input);

      synth.triggerAttackRelease(note, "8n", time);
      console.log("hje", note);

      this.index++;
    },
    refFinder(x, y) {
      return this.$refs["r" + x + y];
    },
    whatDirection(x, y) {
      let index = this.findInArr(x, y);
      let arr = this.highLightedDivs[index];

      return [{ transform: `rotate(${arr.position})` }];
    },
    highlightToggle(x, y) {
      let refName = this.refMaker(x, y);
      let newDirection = event.toElement.classList.value;
      if (this.isArrowRef(refName)) {
        let foundRef = this.arrowRefs.find(arrow => arrow.name === refName);
        foundRef.direction = newDirection;
      } else {
        this.arrowRefs.push({ x, y, name: refName, direction: newDirection });
      }

      const { highLightedDivs } = this;
      let index = this.findInArr(x, y);
      if (!index && index != 0) {
        highLightedDivs.push({ x, y, direction: "center" });
        return;
      }

      switch (newDirection) {
        case "center":
          highLightedDivs.splice(index, 1);
          break;
        case "left":
          highLightedDivs[index].position = "180deg";
          break;
        case "right":
          highLightedDivs[index].position = "0deg";
          break;
        case "up":
          highLightedDivs[index].position = "-90deg";
          break;
        case "down":
          highLightedDivs[index].position = "90deg";
          break;
      }
    },
    handleClick(x, y) {
      let refName = this.refMaker(x, y);

      let ref = this.$refs[refName];

      this.selectedRef = { x, y };

      this.isArrowRef(refName);

      ref[0].classList.add("arrow");

      let coordinates = { x, y };

      this.blinkingDivs(coordinates);
      this.$emit("shoot", { coordinates });
      this.loop();
    },
    blinkingDivs(coordinates) {
      let { x, y } = coordinates;

      for (let i = y; i <= 15; i++) {
        let ref = this.$refs["r" + x + i];
        console.log("ref", this.$refs["r" + i + y]);

        ref[0].style.background = "green";
      }
    },

    isHighligthed(x, y) {
      let answer = this.highLightedDivs.find(
        item => item.x === x && item.y === y
      );
      return answer ? true : false;
    },
    isArrowRef(name) {
      console.log("ref", name);

      let arrowRef = this.arrowRefs.find(arrowRef => arrowRef.name === name);
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

  button {
    outline: none;
    background: none;
    height: 100%;
    width: 100%;
    border: none;
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
  background: black;
}
.highlight {
}
</style>