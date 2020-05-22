<template>
  <div class="slider-wrapper">
    <div
      class="slider"
      @mouseleave="clicked=false"
      @mousedown="mouseHandler"
      @mouseup="clicked=false"
      @mousemove="mouseHandler"
      ref="slider"
    >
      <div class="slider__track"></div>
      <div class="slider__knob" :style="knobPosition"></div>
    </div>
    <span class="value">{{ slideValueToBpm }} {{ value }}</span>
  </div>
</template>
<script>
export default {
  name: "sliders",
  data() {
    return {
      slideValue: 50,
      clicked: false
    };
  },
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    mouseHandler(event) {
      if (event.type === "mousedown") {
        this.clicked = true;
      }

      if (this.clicked) {
        let divPos = this.$refs.slider.getBoundingClientRect();
        let { top, bottom } = divPos;

        let mousePosY = event.clientY;
        let mouseFromTop = mousePosY - top;
        let divBottom = bottom - top;
        let mousePercentage = (mouseFromTop / divBottom) * 100;

        this.slideValue = mousePercentage;
        this.$emit("changedValue", this.slideValueToBpm);
      }
    }
  },
  computed: {
    knobPosition() {
      let topValue =
        this.slideValueToInteger < 100 ? this.slideValueToInteger : 100;
      return { top: `${topValue}%` };
    },
    slideValueToInteger() {
      return Math.round(this.slideValue);
    },
    slideValueToBpm() {
      return 200 - this.slideValueToInteger;
    }
  }
};
</script>
<style lang="scss">
$background: #54bb5a;
$yellow: #d9d283;

.value {
  color: white;
  display: block;
  margin-top: 10px;
  text-align: center;
}

.slider-wrapper {
  height: 100%;
  position: relative;
  background: transparent;
  width: 40%;
  max-height: 100%;
}
.slider {
  height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  z-index: -2;

  &__track {
    background: $background;
    width: 5%;
  }

  &__knob {
    background: $yellow;

    height: 4%;
    width: 75%;
    position: absolute;
    border-radius: 10px;
  }
}
</style>
