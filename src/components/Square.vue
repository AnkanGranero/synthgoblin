<template>
  <div class="square" @mousedown="handleClick">
    <Direction-picker
      v-if="directionPickerOpen"
      @directionSet="addArrowRef"
      @removeArrowDiv="removeArrowDiv"
    />

    <div v-if="direction" class="square__arrow-wrapper" @click="clickedOnArrow">
      <div :class="whatDirection"></div>
    </div>
  </div>
</template>

<script>
import DirectionPicker from "./DirectionPicker";
export default {
  name: "Square",

  props: {
    refForSquare: {
      default: () => {},
      type: Object
    },
    directionPickerOpen: {
      default: false,
      type: Boolean
    }
  },
  components: {
    DirectionPicker
  },
  data() {
    return {
      isClicked: false,
      direction: ""
    };
  },
  methods: {
    handleClick() {
      this.openDirectionPicker();
      return;
    },
    openDirectionPicker() {
      if (this.directionPickerOpen) {
        this.closeDirectionPicker();
        return;
      }
      const { x, y } = this.refForSquare;

      this.$emit("openDirectionPicker", { x, y });
    },

    addArrowRef(payload) {
      this.direction = payload;
      console.log("payload", payload);

      let { x, y, refName } = this.refForSquare;
      this.$store.dispatch("addArrowRef", {
        x,
        y,
        refName,
        direction: payload
      });
    },

    setDirection(payload) {
      this.direction = payload;
    },
    closeDirectionPicker() {
      this.$emit("closeDirectionPicker");
    },
    clickedOnArrow() {
      this.openDirectionPicker();
    },
    removeArrowDiv() {
      let { refName } = this.refForSquare;
      this.direction = "";
      this.$store.dispatch("removeArrowRef", refName);
    }
  },
  computed: {
    whatDirection() {
      /*    if (!this.isClicked) {
        return;
      } */
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
    }
  }
  /*    whatDirection() {
      let direction = this.arrowDirection;
      console.log("direction", direction);

      let degrees;
      switch (direction) {
        case "left":
          degrees = "180deg";
          break;
        case "right":
          degrees = "0deg";
          break;
        case "up":
          degrees = "-90deg";
          break;
        case "down":
          degrees = "90deg";
          break;
      }
      return [{ transform: `rotate(${degrees})` }];
    } */
};
</script>

<style lang="scss">
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
  }
  .arrow-down {
    border-left: $arrow-size solid transparent;
    border-right: $arrow-size solid transparent;

    border-top: $arrow-size solid rgb(51, 51, 51);
  }

  .arrow-right {
    border-bottom: $arrow-size solid transparent;
    border-left: $arrow-size solid rgb(51, 51, 51);

    border-top: $arrow-size solid transparent;
  }
  .arrow-up {
    border-left: $arrow-size solid transparent;
    border-bottom: $arrow-size solid rgb(51, 51, 51);

    border-right: $arrow-size solid transparent;
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
</style>