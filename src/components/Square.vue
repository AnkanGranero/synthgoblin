<template>
  <div class="square">
    <button class="up" @click="handleClick"></button>
    <div class="middle">
      <button class="left" @click="handleClick"></button>
      <div class="center" @click="handleClick" :class="whatDirection"></div>
      <button class="right" @click="handleClick"></button>
    </div>
    <button class="down" @click="handleClick"></button>
    <!--     <img
      src="../assets/arrow.png"
      v-if="isClicked"
      class="image"
      :style="whatDirection"
      alt="arrow"
      @click="play"
    />-->
  </div>
</template>

<script>
export default {
  name: "Square",

  props: {
    refForSquare: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      isClicked: false,
      arrowDirection: ""
    };
  },
  methods: {
    handleClick() {
      let direction = event.toElement.classList.value;

      this.isClicked = true;

      const { x, y, refName } = this.refForSquare;
      console.log("thisarrow", this.arrowDirection, direction);

      if (direction == this.arrowDirection) {
        this.play();
      }
      this.arrowDirection = direction;

      this.$emit("clicked", { x, y, refName, direction, status: "hold" });
    },
    play() {
      const direction = this.arrowDirection;
      const { x, y, refName } = this.refForSquare;
      this.$emit("clicked", { x, y, refName, direction, status: "play" });
    }
  },
  computed: {
    whatDirection() {
      if (!this.isClicked) {
        return;
      }
      let direction = this.arrowDirection;

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
  display: flex;
  position: relative;
  flex-direction: column;
  width: auto;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  z-index: 0;

  button {
    outline: none;
    background: none;
    border: none;
    z-index: 2;
    width: 100%;
  }

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
    .arrow-up {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;

      border-bottom: 10px solid black;
    }

    .arrow-down {
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;

      border-top: 10px solid black;
    }

    .arrow-left {
      width: 0;
      height: 0;
      border-bottom: 10px solid transparent;
      border-right: 10px solid black;

      border-top: 10px solid transparent;
    }

    .arrow-right {
      width: 0;
      height: 0;
      border-bottom: 10px solid transparent;
      border-left: 10px solid black;

      border-top: 10px solid transparent;
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

.arrow {
  border: 5px solid white;
}
</style>