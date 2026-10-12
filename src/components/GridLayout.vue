<template>
  <div class="page-wrapper">
    <div v-for="y in gridSize.y" :key="y" :class="createRowClass(y)">
      <div
        v-for="x in gridSize.x"
        :key="x"
        @mouseover="mouseEventHandler(x, y)"
        :class="createColClass(x)"
        :ref="getRefFromCoordinates(x, y)"
      >
        <square
          :refForSquare="refForSquare(x, y)"
          :highlightPos="highlightPos"
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
import { getRefFromCoordinates } from "../utils/squareRefHelpers";

export default {
  name: "GridLayout",
  components: {
    square,
  },
  data() {
    return {
      mousePos: { x: 1, y: 1 },
    };
  },

  methods: {
    getRefFromCoordinates,
    refForSquare(x, y) {
      const refName = this.getRefFromCoordinates(x, y);
      return {
        x,
        y,
        refName,
      };
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
  },
  computed: {
    ...mapState(["isPlaying", "isMobile"]),
    ...mapGetters(["getColorCenter"]),

    highlightPos() {
      let pos;
      switch (this.isPlaying || this.isMobile) {
        case true:
          pos = this.getColorCenter;

          break;
        case false:
          pos = this.mousePos;
          break;
      }
      return pos;
    },
    gridSize() {
      return this.$store.getters.getGridSize;
    },
  },
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.page-wrapper {
  height: 120vh;
  width: 80vh;
  display: grid;
  grid-auto-rows: auto;
  height: 75%;
  width: 100%;
  @media only screen and (min-width: 768px) {
    /* height: 80vh; */
    height: 100%;
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
</style>
