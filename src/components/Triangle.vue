<template>
  <div class="triangle">
    <div :style="whatDirection"></div>
    <h2 class="triangle__text">
      <slot></slot>
    </h2>
  </div>
</template>

<script>
export default {
  name: "Triangle",
  props: {
    direction: {
      type: String,
      default: "up"
    },
    borderSize: {
      type: String,
      default: "25px"
    },
    color: {
      type: String,
      default: "green"
    }
  },
  computed: {
    playingDiv() {
      return this.$store.state.playingDiv;
    },
    whatDirection() {
      let { direction } = this;
      let x = ["left", "right"];
      let y = ["top", "bottom"];
      let base = [];
      let sides = [];

      switch (direction) {
        case "left" || "right": {
          let index = x.indexOf(direction);

          base = x.splice(index, 1);
          sides = y;
          break;
        }
        case "up" || "down": {
          let bottomOrTop = direction == "up" ? "top" : "bottom";

          let index = y.indexOf(bottomOrTop);

          y.splice(index, 1);
          base = y;
          sides = x;
          break;
        }
      }

      let borderSideA = "border-" + sides[0];
      let borderSideB = "border-" + sides[1];
      let borderBase = "border-" + base[0];

      return {
        width: 0,
        [borderBase]: ` ${this.borderSize} solid green`,
        [borderSideA]: `${this.borderSize} solid transparent`,
        [borderSideB]: `${this.borderSize} solid transparent`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.triangle {
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: white;
  text-align: center;
  align-items: center;

  &__text {
    margin-top: 10px;
    font-size: 1rem;
  }

  /* &__up {
    width: 0;
    border-left: $arrow-border-size solid transparent;
    border-bottom: $arrow-border-size solid rgb(131, 252, 159);
    border-right: $arrow-border-size solid transparent;
  }
  &__left {
    width: 0;
    border-bottom: $arrow-border-size solid transparent;
    border-right: $arrow-border-size solid $arrow-color;
    border-top: $arrow-border-size solid transparent;
  }
  &__down {
    width: 0;
    border-left: $arrow-border-size solid transparent;
    border-right: $arrow-border-size solid transparent;
    border-top: $arrow-border-size solid $arrow-color;
  }

  &__right {
    width: 0;
    border-bottom: $arrow-border-size solid transparent;
    border-left: $arrow-border-size solid $arrow-color;
    border-top: $arrow-border-size solid transparent;
  } */
}
</style>