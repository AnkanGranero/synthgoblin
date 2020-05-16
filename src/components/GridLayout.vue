//jag har en array med den spelande koordinaterna, som när den ersätts först tar
bort styling till den första sen lägger till till den nya //lägg till knappar
för att välja prop value mousePos som highlightTarget // ha en propterty playing
så att om man trycker på en pil när det spelas så kommer modal upp, kanske att
det slutar spela om man trycker någponstans på skärmen

<template>
  <div class="pageWrapper">
    <div v-for="y in 15" :key="y" :class="createGridClass(y)">
      <div
        v-for="x in 15"
        :key="x"
        @mouseover="mouseEventHandler(x, y)"
        :style="colorStyling(x, y)"
        class="button-wrapper"
        :ref="getRefFromCoordinates(x, y)"
      >
        <square
          @openDirectionPicker="openDirectionPicker"
          :refForSquare="refForSquare(x, y)"
          :directionPickerOpen="isdirectionPickerOpen(x, y)"
          @closeDirectionPicker="closeDirectionPicker"
        ></square>
      </div>
    </div>
  </div>
</template>

<script>
import square from "./Square";
import { mapState } from "vuex";

export default {
  name: "GridLayout",
  components: {
    square
  },
  data() {
    return {
      mousePos: { x: 0, y: 0 },

      directionPickerOpen: {}
    };
  },
  props: {
    styling: {
      type: String,
      default: "classic"
    },

    allScales: {
      type: Array,
      default: () => []
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
    isdirectionPickerOpen(x, y) {
      return x == this.directionPickerOpen.x && y == this.directionPickerOpen.y;
    },

    openDirectionPicker(payload) {
      this.directionPickerOpen = payload;
    },

    mouseEventHandler(x, y) {
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

      let numbers = [n, pos];
      numbers.sort((a, b) => b - a);
      let high = numbers[0];
      let low = numbers[1];
      let difference = (high - low) * 18;

      return 250 - difference;
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
    },
    closeDirectionPicker() {
      this.directionPickerOpen = {}; //ändra detta
    }
  },
  computed: {
    ...mapState(["playingDiv", "isPlaying"]),
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
    }
  }
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.pageWrapper {
  height: 120vh;
  width: 80vh;
  display: grid;
  grid-template-rows: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
  @media only screen and (min-width: 768px) {
    /* height: 80vh; */
    height: 100%;
    width: 100%;
  }
}
.button-wrapper {
}

.row {
  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.highlight {
  /*   border: 1px solid rgb(110, 110, 160);
  z-index: 20; */
}
</style>
