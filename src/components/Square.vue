<template>
  <div class="square" @mousedown="handleClick">
    <Direction-picker
      v-if="modalOpen"
      @directionSet="setDirection"
      @removeArrowDiv="removeArrowDiv"
    />

    <div v-if="direction" class="square__arrow-wrapper" @click="play">
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
    modalOpen: {
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
      if (!this.direction) {
        this.openModal();
        return;
      }
      this.closeModal();
    },
    openModal() {
      if (this.modalOpen) {
        this.closeModal();
        return;
      }
      const { x, y } = this.refForSquare;

      this.$emit("openingModal", { x, y });
    },

    emitArrowRef(arg) {
      let { x, y, refName } = this.refForSquare;
      let { direction } = this;
      this.$emit("click", { x, y, refName, direction, status: arg });
    },

    setDirection(payload) {
      console.log("direction set ", payload);

      this.direction = payload;
      this.emitArrowRef("hold"); //hold kan vara ett dåligt namn eftersom den inte kommer stanna spelandet
    },
    closeModal() {
      this.$emit("closeModal");
    },
    play() {
      if (!this.$store.state.isPlaying) {
        this.emitArrowRef("play");
      } else {
        this.openModal();
      }
    },
    removeArrowDiv() {
      console.log("nu hoppas jag den kan tas bort ");

      this.direction = "";
      this.emitArrowRef("remove");
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
  //denna kod är nu duplicerad
  .arrow-left {
    border-bottom: 10px solid transparent;
    border-right: 10px solid rgb(51, 51, 51);

    border-top: 10px solid transparent;
  }
  .arrow-down {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-top: 10px solid rgb(51, 51, 51);
  }

  .arrow-right {
    border-bottom: 10px solid transparent;
    border-left: 10px solid rgb(51, 51, 51);

    border-top: 10px solid transparent;
  }
  .arrow-up {
    border-left: 10px solid transparent;
    border-bottom: 10px solid rgb(51, 51, 51);

    border-right: 10px solid transparent;
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