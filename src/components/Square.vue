<template>
  <div
    class="square"
    :class="isStartingArrow"
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
    <div
      v-if="transformedSquare && transformedSquare.type === 'Portal'"
      class="portal"
      @mouseleave="portalClicked = false"
    >
      <span class="portal__number">{{ portalNumber() }}</span>
    </div>
    <div v-if="direction" class="square__arrow-wrapper" @click="clickedOnArrow">
      <div :class="whatDirection"></div>
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
      portalClicked: false,
      portal: false,
      touchStart: null,
      x: 0,
      y: 0,
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
  },
  components: {
    DirectionPicker,
  },
  mounted() {
    if (this.isMobile) {
      this.$el.addEventListener("touchstart", (e) => this.handleTouchStart(e));
      this.$el.addEventListener("touchmove", (e) => this.handleTouchMove(e));
      this.$el.addEventListener("touchend", (e) => this.handTouchEnd(e));
    }
  },
  methods: {
    ...mapActions([
      "addArrowRef",
      "addTransformedSquare",
      "removeTransformedSquare",
      "togglePause",
    ]),
    handTouchEnd(e) {
      e.preventDefault();
      if (!this.touchStart) return;
      const { x, y } = this;

      this.directionBasedOnTouch(x, y);
      this.touchStart = null;
    },
    handleTouchStart(e) {
      if (this.transformedSquare) {
        this.removeTransformedSquare(this.removeTransformedSquare);
        return;
      }

      if (this.portalCreatorActive) {
        this.addPortal();
        return;
      } else {
        const { screenX: x, screenY: y } = e.touches[0];
        this.touchStart = { x, y };
        this.x = x;
        this.y = y;
      }
    },
    handleTouchMove(e) {
      e.preventDefault();
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
        this.removeTransformedSquare(this.transformedSquare);
        return;
      }
      let payloadForStore = { ...this.refForSquare, direction };

      this.addArrowRef(payloadForStore);
    },

    handleClick(event) {
      event.preventDefault();
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
      this.togglePause(this.refForSquare);
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
    ]),
    ...mapGetters([
      "getPortalNumber",
      "findTransformedSquareIndex",
      "findTransformedSquare",
      "getStartingArrow",
    ]),
    transformedSquare() {
      return this.findTransformedSquare(this.refForSquare.refName);
    },
    isStartingArrow() {
      if (!this.getStartingArrow) return;
      return this.getStartingArrow.refName === this.refForSquare.refName
        ? "starting-arrow"
        : "";
    },
    refIndex() {
      return this.$store.getters.findTransformedSquareIndex(
        this.refForSquare.refName
      );
    },
    direction() {
      return this.transformedSquare ? this.transformedSquare.direction : null;
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
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
