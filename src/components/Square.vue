<template>
  <div class="square" @mousedown="handleClick">
    <slot>
      <Direction-picker
        v-if="directionPickerOpen"
        @directionSet="addingArrowRef"
        @removeArrowDiv="removeArrowDiv"
        @closeDirectionPicker="directionPickerOpen = false"
      />
    </slot>
    <div v-if="isItPortal" class="portal">
      <span
        v-if="portalClicked"
        class="portal__invisible-overlay"
        @mouseleave="portalClicked = false"
        @click="portalClicked = false"
      ></span>
      <span class="portal__number" @click="handleClickOnPortal">{{
        portalNumber()
      }}</span>
    </div>
    <div v-if="direction" class="square__arrow-wrapper" @click="clickedOnArrow">
      <div :class="[whatDirection, hidden]"></div>
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
      portalClicked: false
    };
  },

  props: {
    refForSquare: {
      default: () => {},
      type: Object
    }
  },
  components: {
    DirectionPicker
  },

  methods: {
    ...mapActions(["addArrowRef", "createPortal", "removePortal"]),

    handleClickOnPortal() {
      if (this.portalClicked) {
        this.removePortal(this.refForSquare.refName);
        return;
      }
      this.portalClicked = true;
    },
    handleClick(event) {
      event.preventDefault();
      if (this.isItPortal) {
        return;
      }
      if (!this.direction && this.portalCreatorActive) {
        this.createPortal(this.refForSquare);
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
      let { x, y, refName } = this.refForSquare;
      let payloadForStore = { x, y, refName, direction: payload };

      this.addArrowRef(payloadForStore);
    },

    clickedOnArrow() {
      this.$emit("closeDirectionPicker");
    },
    removeArrowDiv() {
      let { refName } = this.refForSquare;
      /*       this.direction = ""; */
      this.$store.dispatch("removeArrowRef", refName);
    },
    portalNumber() {
      let { refName } = this.refForSquare;
      return this.getPortalNumber(refName);
    }
  },

  computed: {
    ...mapState(["portalCreatorActive"]),
    ...mapGetters(["getArrowRefDirection", "isPortal", "getPortalNumber"]),
    direction() {
      return this.getArrowRefDirection(this.refForSquare.refName);
    },
    isItPortal() {
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
      return cssClass;
    },
    hidden() {
      return this.directionPickerOpen ? "hidden" : null;
    }
  }
};
</script>

<style lang="scss">
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
  }
  .arrow-down {
    border-left: $arrow-size solid transparent;
    border-right: $arrow-size solid transparent;
    border-top: $arrow-size solid rgb(51, 51, 51);
    position: absolute;
  }

  .arrow-right {
    border-bottom: $arrow-size solid transparent;
    border-left: $arrow-size solid rgb(51, 51, 51);
    border-top: $arrow-size solid transparent;
    position: absolute;
  }
  .arrow-up {
    border-left: $arrow-size solid transparent;
    border-bottom: $arrow-size solid rgb(51, 51, 51);
    border-right: $arrow-size solid transparent;
    position: absolute;
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

  &__number {
    z-index: 2;
  }

  &__invisible-overlay {
    position: absolute;
    height: 100px;
    width: 100px;
  }
}
</style>
