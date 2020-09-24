<template>
  <div
    class="direction-picker"
    @mouseleave="handleMouseLeave()"
    @mouseup="handleMouseUp()"
  >
    <div
      class="direction-picker__wrapper direction-picker__row--1 direction-picker__column--2"
      @mousedown="setDirection('up')"
      @mouseover="handleMouseOver('up')"
    >
      <Triangle :borderSize="'12px'" />
    </div>

    <div
      class="direction-picker__wrapper direction-picker__row--2 direction-picker__column--1"
      @mousedown="setDirection('left')"
      @mouseover="handleMouseOver('left')"
    >
      <Triangle :direction="'left'" :borderSize="'12px'" />
    </div>
    <div
      class="direction-picker__wrapper direction-picker__row--2 direction-picker__column--2"
      @mousedown="removeArrowDiv"
      @mouseover="handleMouseOver('')"
    ></div>
    <div
      class="direction-picker__wrapper direction-picker__row--2 direction-picker__column--3"
      @mousedown="setDirection('right')"
      @mouseover="handleMouseOver('right')"
    >
      <Triangle :direction="'right'" :borderSize="'12px'" />
    </div>

    <div
      class="direction-picker__wrapper direction-picker__row--3 direction-picker__column--2"
      @mousedown="setDirection('down')"
      @mouseover="handleMouseOver('down')"
    >
      <Triangle :direction="'down'" :borderSize="'12px'" />
    </div>
  </div>
</template>
<script>
import Triangle from "../components/Triangle";
export default {
  name: "directionPicker",
  components: {
    Triangle
  },
  data() {
    return {
      mouseDown: true,
      preliminaryDirection: ""
    };
  },
  methods: {
    setDirection(dir) {
      this.$emit("directionSet", dir);
    },
    handleMouseOver(direction) {
      console.log("Handle mpouseover");
      if (this.mouseDown) {
        console.log("lets go");
        this.preliminaryDirection = direction;
      }
    },
    handleMouseDown() {
      console.log("MOUSE DOWN");
      this.mouseDown = true;
    },
    handleMouseUp() {
      this.mouseDown = false;
      console.log("preliminary", this.preliminaryDirection);
      if (this.preliminaryDirection) {
        this.setDirection(this.preliminaryDirection);
      }
    },
    removeArrowDiv() {
      this.$emit("removeArrowDiv");
    },
    handleMouseLeave() {
      if (this.mouseDown) {
        this.setDirection(this.preliminaryDirection);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$arrow-color: black;
$arrow-border-size: 10px;
.direction-picker {
  height: 300%;
  width: 300%;

  position: relative;
  top: -100%;
  left: -100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    "top left bottom"
    "up middle down"
    "up right bottom";

  &__row--1 {
    grid-row-start: 1;
    grid-row-end: 2;
  }
  &__row--2 {
    grid-row-start: 2;
    grid-row-end: 3;
  }
  &__row--3 {
    grid-row-start: 3;
  }

  &__column--1 {
    grid-column-start: 1;
    grid-column-end: 2;
  }
  &__column--2 {
    grid-column-start: 2;
    grid-column-end: 3;
  }

  &__column--3 {
    grid-column-start: 3;
  }

  &__wrapper {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
}
</style>
