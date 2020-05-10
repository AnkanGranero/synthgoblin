<template>
  <div class="triangle">
    <div :style="whatDirection"></div>
    <h2 v-if="headerText" class="triangle__text">{{ headerText }}</h2>
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
      default: "grey"
    },
    headerText: {
      type: String,
      default: ""
    }
  },
  computed: {
    whatDirection() {
      let { direction } = this;
      let x = ["left", "right"];
      let y = ["top", "bottom"];
      let base = "";
      let sides = [];

      switch (direction) {
        case "right": {
          base = "left";
          sides = y;
          break;
        }
        case "left": {
          base = "right";
          sides = y;
          break;
        }
        case "up": {
          base = "bottom";
          sides = x;
          break;
        }
        case "down": {
          base = "top";
          sides = x;
          break;
        }
      }

      let borderSideA = "border-" + sides[0];
      let borderSideB = "border-" + sides[1];
      let borderBase = "border-" + base;

      return {
        width: 0,
        [borderBase]: ` ${this.borderSize} solid ${this.color}`,
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
  height: 100%;
}
/* .triangle {
  display: flex;
  justify-content: center;
  flex-direction: column;
  color: white;
  text-align: center;
  align-items: center;
  height: 100%;

  &__text {
    margin-top: 10px;
    font-size: 1rem;
  } */

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
</style>
