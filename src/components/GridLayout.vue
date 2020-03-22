//jag har en array med den spelande koordinaterna, som när den ersätts 
först tar bort styling till den första sen lägger till till den nya


//lägg till knappar för att välja prop value mousePos som highlightTarget
// ha en propterty playing så att om man trycker på en pil när det spelas så kommer modal upp,
kanske att det slutar spela om man trycker någponstans på skärmen

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
        <square
          @click="handleClick"
          @openingModal="openingModal"
          :refForSquare="refForSquare(x,y)"
          :modalOpen="isModalOpen(x,y)"
          @closeModal="closeModal"
        ></square>
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
      mousePos: { x: 0, y: 0 },
      arrowRef: [],
      arrowRefs: [],
      playingDiv: { x: 10, y: 10 },
      allScales: [],
      direction: "",
      modalOpen: {}
    };
  },
  props: {
    styling: {
      type: String,
      default: "classic"
    },
    highlightTarget: {
      type: String,
      default: "playingDiv"
    },
    scale: {
      type: Array,
      default: () => [1, 2, 2, 2, 1, 2, 2]
    }
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
        startKey += this.scale[i % 7];
      }
      this.allScales = allArrs;
    },
    createPitchArr(startKey) {
      let arr = [];
      let pianoKey = startKey;
      for (let i = 0; i <= 15; i++) {
        arr.push(this.hertzCalculator(pianoKey));
        pianoKey += this.scale[i % 7];
      }
      return arr;
    },
    hertzCalculator(n) {
      return Math.pow(2, n / 12) * 220;
    },
    getRefFromCoordinates(x, y) {
      return `r${x}${y}`;
    },

    colorStyling(x, y) {
      switch (this.styling) {
        case "80s":
          return {
            background: this.colorCalcDifference(x, y),
            /*    border: `1px solid ${this.colorCalcDifference(y, x)}`, */
            /*  border: "1px solid red", */
            "box-shadow": `-5px -5px 10px ${this.colorCalcDifference(y, x)} `
          };
        case "classic":
          return {
            background:
              "rgb(" +
              this.colorCalcDif(y, "y") +
              "," +
              this.colorCalcDif(x, "x") +
              ",250)"
          };
        /*    return {
            background:
              "rgb(" + this.colorCalcY(y) + "," + this.colorCalcX(x) + ",250)"
          }; */
      }
    },
    isModalOpen(x, y) {
      return x == this.modalOpen.x && y == this.modalOpen.y;
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
      console.log("adding arrow");

      let { x, y, direction, refName } = payload;

      let indexOfDuplicate = this.checkIfArrowRefExists(refName);
      if (indexOfDuplicate !== -1) {
        this.arrowRefs[indexOfDuplicate].direction = direction;
        return;
      }
      this.arrowRefs.push({ x, y, name: refName, direction: direction });
    },
    removeArrowRef(payload) {
      let index = this.checkIfArrowRefExists(payload.refName);
      console.log("lets remove", index);

      if (index !== -1) {
        this.arrowRefs.splice(index, 1);
        console.log("removed ", this.arrowRefs);
      }
    },
    checkIfArrowRefExists(refName) {
      return this.arrowRefs.findIndex(ref => ref.name == refName);
    },

    openingModal(payload) {
      this.modalOpen = payload;
    },

    handleClick(payload) {
      if (payload.status == "remove") {
        this.removeArrowRef(payload);
        return;
      }
      this.addArrowRef(payload);
      if (payload.status == "play") {
        this.playingDiv = payload;
        this.$store.dispatch("changeIsPlayingState", true);
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
      let subtract = n - (this.highlightPos.y - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcDif(n, coordinate) {
      let pos = this.highlightPos[coordinate];

      let numbers = [n, pos];
      numbers.sort((a, b) => b - a);
      let high = numbers[0];
      let low = numbers[1];
      let difference = (high - low) * 18;

      return 250 - difference;
    },
    colorCalcX(n) {
      let subtract = n - (this.highlightPos.x - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcXY(x, y) {
      let numbers = [x, y];

      numbers.sort((a, b) => a - b);
      let highest = numbers[0];
      let lowest = numbers[1];
      let add = highest + this.highlightPos[highest];
      let subtract = lowest - (this.highlightPos[lowest] - 1);

      numbers[highest] = add;
      numbers[lowest] = subtract;
    },
    colorCalcDifference(x, y) {
      let xArr = [x, this.highlightPos.x];
      let yArr = [y, this.highlightPos.y];
      xArr.sort((a, b) => b - a);
      yArr.sort((a, b) => b - a);
      let subtractorX = xArr[0] - xArr[1];

      let growedSubtractorX = subtractorX * 18;
      let subtractorY = yArr[0] - yArr[1];
      let growedSubtractorY = subtractorY * 18;

      let red = 200 - growedSubtractorX;
      let green = 200 - growedSubtractorY;
      return "rgb(" + green + "," + red + ",250)";
    },
    closeModal() {
      this.modalOpen = {}; //ändra detta
    }
  },
  computed: {
    highlightPos() {
      let pos;
      switch (this.highlightTarget) {
        case "playingDiv":
          pos = this.playingDiv;
          break;
        case "mousePos":
          pos = this.mousePos;
          break;
      }
      return pos;
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
  border: 1px solid rgb(110, 110, 160);
  z-index: 20;
}
</style>