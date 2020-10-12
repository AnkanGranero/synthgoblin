<template>
  <div class="page-wrapper">
    <div v-for="y in gridSize.y" :key="y" :class="createRowClass(y)">
      <div
        v-for="x in gridSize.x"
        :key="x"
        @mouseover="mouseEventHandler(x, y)"
        :style="colorStyling(x, y, getHighlightPos, 'background')"
        :class="createColClass(x)"
        :ref="getRefFromCoordinates(x, y)"
      >
        <square
          :refForSquare="refForSquare(x, y)"
          @remove-portal-force-re-render="mousePos = { x, y }"
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
import { colorStyling } from "../utils/colorCalc";

export default {
  name: "GridLayout",
  components: {
    square
  },

  props: {
    styling: {
      type: String,
      default: "classic"
    }
  },

  methods: {
    colorStyling,
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

    mouseEventHandler(x, y) {
      this.$store.dispatch("setMousePos", { x, y });
    },
    createRowClass(n) {
      return `row row-${n}`;
    },
    createColClass(n) {
      return `col col-${n}`;
    }
  },
  computed: {
    ...mapState([
      "playingDiv",
      "isPlaying",
      "portals",
      "arrowRefs",
      "mousePos"
    ]),
    ...mapGetters(["getHighlightPos"]),

    /*     colorCenter() {
      return this.playingDiv
        ? this.playingDiv
        : { x: 10, y: 10, refName: "r10,10" };
    }, */

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
