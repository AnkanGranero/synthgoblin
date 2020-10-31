<template>
  <div class="square" :class="isStartingArrow" @mousedown="handleClick">
    <slot>
      <Direction-picker
        v-if="directionPickerOpen"
        @directionSet="addingArrowRef"
        @removeArrowDiv="removeArrowDiv"
        @closeDirectionPicker="directionPickerOpen = false"
      />
    </slot>
    <div
      v-if="portal && isItStillPortal"
      class="portal"
      @mouseleave="portalClicked = false"
    >
      <span class="portal__number" @click="handleClickOnPortal">{{
        portalNumber()
      }}</span>
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
      y: 0
    };
  },

  props: {
    refForSquare: {
      default: () => {},
      type: Object
    },
    refreshIndex: {
      type: Number
    }
  },
  components: {
    DirectionPicker
  },
  mounted() {
    this.getPortal();
    if (this.isMobile) {
      this.$el.addEventListener("touchstart", e => this.handleTouch(e));
      this.$el.addEventListener("touchmove", e => this.handleTouch(e));
      this.$el.addEventListener("touchend", e => this.handTouchEnd(e));
    }
  },
  methods: {
    ...mapActions(["addArrowRef", "createPortal", "removePortal"]),
    handTouchEnd(e) {
      e.preventDefault();
      const { x, y } = this;

      this.directionBasedOnTouch(x, y);
    },
    handleTouch(e) {
      e.preventDefault();

      const { screenX: x, screenY: y } = e.touches[0];
      if (e.type === "touchstart") {
        this.touchStart = { x, y };
      }

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
        this.removeArrowDiv(this.refForSquare);
        return;
      }
      let payloadForStore = { ...this.refForSquare, direction };

      this.addArrowRef(payloadForStore);
    },
    getPortal() {
      return (this.portal = this.portalsHashObject[this.refForSquare.refName]);
    },
    handleClickOnPortal() {
      if (this.portalClicked || !this.portalNumber()) {
        this.removePortal(this.refForSquare.refName);
        this.$emit("remove-portal-force-re-render");
        this.portalClicked = false;
        this.portal = "";
        return;
      }
      this.portalClicked = true;
    },

    handleClick(event) {
      event.preventDefault();
      if (this.portal && this.getPortal()) {
        return;
      }
      if (!this.direction && this.portalCreatorActive) {
        this.createPortal(this.refForSquare);
        this.getPortal();
        this.$emit("remove-portal-force-re-render");

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

    addingArrowRef(payload) {
      let payloadForStore = { ...this.refForSquare, direction: payload };

      this.addArrowRef(payloadForStore);
    },

    clickedOnArrow() {
      this.$emit("closeDirectionPicker", this.refForSquare);
    },
    removeArrowDiv() {
      let { refName } = this.refForSquare;
      this.$store.dispatch("removeArrowRef", refName);
    },
    portalNumber() {
      let { refName } = this.refForSquare;
      return this.getPortalNumber(refName);
    }
  },

  computed: {
    ...mapState([
      "portalCreatorActive",
      "portalsHashObject",
      "arrowRefs",
      "isMobile"
    ]),
    ...mapGetters(["isPortal", "getPortalNumber", "findArrowRefIndex"]),
    isStartingArrow() {
      return this.refIndex === 0 ? "starting-arrow" : "";
    },
    refIndex() {
      return this.findArrowRefIndex(this.refForSquare.refName);
    },
    direction() {
      if (this.refIndex === -1) return;
      return this.arrowRefs[this.refIndex].direction;
    },

    isItStillPortal() {
      return this.isPortal(this.refForSquare.refName);
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
    }
  }
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
