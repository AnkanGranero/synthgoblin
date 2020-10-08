<template>
  <div class="page-wrapper">
    <div v-for="y in gridSize.y" :key="y" :class="createRowClass(y)">
      <div
        v-for="x in gridSize.x"
        :key="x"
        @mouseover="mouseEventHandler(x, y)"
        :style="colorStyling(x, y)"
        :class="createColClass(x)"
        :ref="getRefFromCoordinates(x, y)"
      >
        <square
          :refForSquare="refForSquare(x, y)"
          @clicked-on-square="$emit('clicked-on-square', $event)"
        >
        </square>
      </div>
    </div>
  </div>
</template>

<script>
import square from "./Square";
import { mapState, mapGetters } from "vuex";

export default {
  name: "GridLayout",
  components: {
    square
  },
  data() {
    return {
      mousePos: { x: 0, y: 0 }
    };
  },
  props: {
    styling: {
      type: String,
      default: "classic"
    }
  },

  methods: {
    getRefFromCoordinates(x, y) {
      return `r${x}-${y}`;
    },
    refForSquare(x, y) {
      const refName = this.getRefFromCoordinates(x, y);
      return {
        x,
        y,
        refName
      };
    },
    addHighlight(refName) {
      let ref = this.$refs[refName];
      if (ref) {
        ref[0].classList.remove("highlight");
      }
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
        case "classic": {
          let backgroundColors = {
            background: this.colorCalcDifBoth(x, y)
          };
          /*         this.$store.dispatch("setBackgroundColors", backgroundColors);*/
          return backgroundColors;
        }
      }
    },

    mouseEventHandler(x, y) {
      this.mousePos = { x, y };
    },
    createRowClass(n) {
      return `row row-${n}`;
    },
    createColClass(n) {
      return `col col-${n}`;
    },
    colorCalcY(n) {
      let subtract = n - (this.highlightPos.y - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcDifBoth(x, y) {
      if (
        this.isPlaying &
        (x === this.colorCenter.x) &
        (y === this.colorCenter.y)
      ) {
        return "white";
      }
      return (
        "rgb(" +
        this.colorCalcDif(y, "y") +
        "," +
        this.colorCalcDif(x, "x") +
        ",250)"
      );
    },

    colorCalcDif(n, coordinate) {
      let pos = this.highlightPos[coordinate];

      let availableDistance = this.gridSize[coordinate] - 1;

      let numbers = [n, pos];
      numbers.sort((a, b) => b - a);
      let high = numbers[0];
      let low = numbers[1];
      let difference = high - low;
      let percentageAway = difference / availableDistance;

      let invert = 250 * percentageAway;
      return 250 - invert;
    },
    /*     colorCalcX(n) {
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
    }, */
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
    }
  },
  computed: {
    ...mapState(["playingDiv", "isPlaying", "portals", "arrowRefs"]),
    /*     ...mapGetters(["isPortal"]), */
    colorCenter() {
      return this.playingDiv
        ? this.playingDiv
        : { x: 10, y: 10, refName: "r10,10" };
    },
    highlightPos() {
      let pos;
      switch (this.isPlaying) {
        case true:
          pos = this.colorCenter;

          break;
        case false:
          pos = this.mousePos;
          break;
      }
      return pos;
    },
    gridSize() {
      return this.$store.getters.getGridSize;
    }
  }
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.page-wrapper {
  height: 120vh;
  width: 80vh;
  display: grid;
  grid-auto-rows: auto;
  height: 100%;
  width: 100%;
  @media only screen and (min-width: 768px) {
    /* height: 80vh; */
  }
}
.col {
  width: 100%;
  height: 100%;
}

.row {
  display: flex;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.highlight {
  /*   border: 1px solid rgb(110, 110, 160);
  box-sizing: border-box; */
  z-index: 20;
}
</style>
