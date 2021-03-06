<template>
  <div
    class="square"
    :style="colorStyling"
    :class="{ startingArrow: isStartingArrow }"
    @contextmenu="handleRightClick"
    @mousedown="handleClick"
  >
    <slot>
      <Direction-picker
        v-if="directionPickerOpen"
        @directionSet="addArrow"
        @removeArrowDiv="removeTransformedSquare(transformedSquare)"
        @closeDirectionPicker="directionPickerOpen = false"
      />
    </slot>

    <div v-if="transformedSquare" class="square__arrow-wrapper">
      <div :class="transformedSquareStyle">
        <span
          v-if="transformedSquare.type === 'Portal'"
          class="portal__number"
          >{{ portalNumber() }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import DirectionPicker from "./DirectionPicker";
export default {
  name: "Square",
  data() {
    return {
      directionPickerOpen: false,
      portal: false,
      touchStart: null,
      x: 0,
      y: 0,
      longTouch: false,
    };
  },

  props: {
    refForSquare: {
      default: () => {},
      type: Object,
    },
    refreshIndex: {
      type: Number,
    },
    highlightPos: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    DirectionPicker,
  },
  mounted() {
    if (this.isMobile) {
      this.$el.addEventListener("touchstart", (e) => this.handleTouchStart(e));
      this.$el.addEventListener("touchmove", (e) => this.handleTouchMove(e));
      this.$el.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    }
  },
  methods: {
    ...mapActions([
      "addArrowRef",
      "addTransformedSquare",
      "removeTransformedSquare",
      "togglePause",
    ]),
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
    handleTouchEnd(e) {
      e.preventDefault();
      this.longTouch = false;
      if (!this.touchStart) return;
      if (this.portalCreatorActive && !this.transformedSquare) {
        this.addPortal();
        return;
      }
      const { x, y } = this;

      this.directionBasedOnTouch(x, y);
      this.touchStart = null;
    },
    handleTouchStart(e) {
      if (this.transformedSquare) {
        this.removeTransformedSquare(this.transformedSquare);
        return;
      }
      this.longTouch = true;
      setTimeout(() => {
        if (this.longTouch) {
          this.addTransformedSquare({ ...this.refForSquare, type: "Pause" });
        }
      }, 400);

      const { screenX: x, screenY: y } = e.touches[0];
      this.touchStart = { x, y };
      this.x = x;
      this.y = y;
    },
    handleTouchMove(e) {
      e.preventDefault();
      this.longTouch = false;
      const { screenX: x, screenY: y } = e.touches[0];
      this.x = x;
      this.y = y;
    },

    directionBasedOnTouch(x2, y2) {
      let direction;
      const x = this.touchStart.x;
      const y = this.touchStart.y;
      const xDifference = x > x2 ? x - x2 : x2 - x;
      const yDifference = y > y2 ? y - y2 : y2 - y;

      if (xDifference > yDifference) {
        direction = x > x2 ? "left" : "right";
      }
      if (yDifference > xDifference) {
        direction = y > y2 ? "up" : "down";
      }
      if (xDifference === yDifference) {
        return;
      }
      let payloadForStore = { ...this.refForSquare, direction, type: "Arrow" };

      this.addTransformedSquare(payloadForStore);
    },

    handleClick(event) {
      event.preventDefault();
      if (this.isMobile) return;
      if (this.directionPickerOpen) {
        this.directionPickerOpen = false;
        return;
      }
      if (event.button === 2) return;
      if (this.transformedSquare) {
        this.removeTransformedSquare(this.transformedSquare);
        return;
      }

      if (this.portalCreatorActive) {
        this.addPortal();

        return;
      }
      if (this.directionPickerOpen) {
        this.directionPickerOpen = false;
        return;
      }
      this.directionPickerOpen = true;
      this.$emit("clicked-on-square", this.refForSquare);
      return;
    },
    handleRightClick(event) {
      event.preventDefault();
      if (this.isMobile) return;
      this.addTransformedSquare({ ...this.refForSquare, type: "Pause" });
    },

    addArrow(payload) {
      let payloadForStore = {
        ...this.refForSquare,
        direction: payload,
        type: "Arrow",
      };

      this.addTransformedSquare(payloadForStore);
    },
    addPortal() {
      this.addTransformedSquare({ ...this.refForSquare, type: "Portal" });
    },

    clickedOnArrow() {
      this.$emit("closeDirectionPicker", this.refForSquare);
    },

    portalNumber() {
      let { refName } = this.refForSquare;
      return this.getPortalNumber(refName);
    },
  },

  computed: {
    ...mapState([
      "portalCreatorActive",
      "portalsHashObject",
      "arrowRefs",
      "isMobile",
      "transformedSquares",
      "isPlaying",
      "gridSize",
    ]),
    ...mapGetters([
      "getPortalNumber",
      "findTransformedSquareIndex",
      "findTransformedSquare",
      "getStartingArrow",
      "getColorCenter",
    ]),
    colorStyling() {
      const { x, y } = this.refForSquare;
      if (this.isStartingArrow) {
        return;
      } else if (
        this.isPlaying &
        (x === this.getColorCenter.x) &
        (y === this.getColorCenter.y)
      ) {
        return {
          background: "white",
          border: "1px solid black",
          boxSizing: "border-box",
          borderBottom: "1px solid black",
        };
      } else {
        return {
          background: `rgb(
        ${this.colorCalcDif(y, "y")},
        ${this.colorCalcDif(x, "x")},250)`,
        };
      }
    },
    transformedSquare() {
      return this.findTransformedSquare(this.refForSquare.refName);
    },
    isStartingArrow() {
      if (!this.getStartingArrow) return;
      return this.getStartingArrow.refName === this.refForSquare.refName;
    },
    refIndex() {
      return this.$store.getters.findTransformedSquareIndex(
        this.refForSquare.refName
      );
    },
    direction() {
      return this.transformedSquare ? this.transformedSquare.direction : null;
    },
    transformedSquareStyle() {
      if (!this.transformedSquare) return;
      let styling;

      switch (this.transformedSquare.type) {
        case "Arrow": {
          styling = this.whatDirection;
          break;
        }
        case "Pause": {
          styling = "pause";
          break;
        }
        case "Portal": {
          styling = "portal";
          break;
        }
      }
      return styling;
    },
    whatDirection() {
      let { direction } = this;

      let cssClass;
      switch (direction) {
        case "left":
          cssClass = "arrow-left";
          break;
        case "right":
          cssClass = "arrow-right";
          break;
        case "up":
          cssClass = "arrow-up";
          break;
        case "down":
          cssClass = "arrow-down";
          break;
        case "center":
          cssClass = "circle";
          break;
      }
      let hidden = this.directionPickerOpen ? "hidden" : null;
      let isStartingArrow = this.isStartingArrow
        ? cssClass + "-starting-arrow"
        : "";
      return [cssClass, hidden, isStartingArrow];
    },
  },
};
</script>

<style lang="scss">
$starting-arrow: red;

.hidden {
  display: none;
}

.square {
  height: 100%;
  width: 100%;
  /*   display: flex; */
  justify-content: center;
  /* position: relative; */
  flex-direction: column;
  width: auto;
  align-items: center;
  box-sizing: border-box;
  z-index: 0;

  .up,
  .down {
    height: 100%;
    align-self: center;
  }

  .middle {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .center {
      width: 100%;
    }
    .circle {
      background: rgb(93, 254, 112);
      border-radius: 100%;
    }

    //jag kan ju göra någon funktion som skapar denna styling efter riktning, men får bli senare
  }

  &__arrow-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  $arrow-size: 10px;
  //denna kod är nu duplicerad
  .arrow-left {
    border-bottom: $arrow-size solid transparent;
    border-right: $arrow-size solid rgb(51, 51, 51);
    border-top: $arrow-size solid transparent;
    position: absolute;
    &-starting-arrow {
      border-right: $arrow-size solid white;
    }
  }
  .arrow-down {
    border-left: $arrow-size solid transparent;
    border-right: $arrow-size solid transparent;
    border-top: $arrow-size solid rgb(51, 51, 51);
    position: absolute;
    &-starting-arrow {
      border-top: $arrow-size solid white;
    }
  }

  .arrow-right {
    border-bottom: $arrow-size solid transparent;
    border-left: $arrow-size solid rgb(51, 51, 51);
    border-top: $arrow-size solid transparent;
    position: absolute;
    &-starting-arrow {
      border-left: $arrow-size solid white;
    }
  }
  .arrow-up {
    border-left: $arrow-size solid transparent;
    border-bottom: $arrow-size solid rgb(51, 51, 51);
    border-right: $arrow-size solid transparent;
    position: absolute;
    &-starting-arrow {
      border-bottom: $arrow-size solid white;
    }
  }
}
.image {
  position: absolute;
  z-index: -2;
  height: 100%;
  img:hover {
    height: 2rem;
  }
}
//används denna?

.pause {
  height: 1px;
  background: black;
  width: 60%;
}
.arrow {
  border: 5px solid white;
}
.portal {
  height: 90%;
  background: black;
  width: 90%;
  display: flex;
  position: relative;
  border-radius: 100%;
  top: 5%;
  left: 5%;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: white;
  cursor: pointer;

  &__number {
    font-family: "VT323";

    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    @media only screen and (min-width: $ipad) {
      font-size: 25px;
    }
    @media screen and(min-width: $laptop ) {
      font-size: 30px;
    }
  }

  &__invisible-overlay {
    position: absolute;
    height: 100px;
    width: 100px;
    background: red;
    opacity: 0.2;
    /*   z-index: 0; */
  }
}
.starting-arrow {
  background: black;
}
</style>
