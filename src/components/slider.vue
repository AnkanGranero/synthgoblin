<template>
  <div class="slider-wrapper">
    <div
      class="slider"
      @mouseleave="clicked=false"
      @mousedown="mouseHandler"
      @mouseup="clicked=false"
      @mousemove="mouseHandler"
      @touchstart="clicked=true"
      @touchmove="mouseHandler"
      @touchend="clicked=false"
      @touchcancel="clicked=false"
      ref="slider"
    >
      <div class="slider__track"></div>
      <div class="slider__knob" :style="knobPosition"></div>
    </div>
    <span class="type">
      {{ type }}
      <span class="value">{{ customSlideValue }}</span>
    </span>
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
    type: {
      type: String,
      default: ""
    },
    maxValue: {
      type: Number,
      default: 100
    },
    minValue: {
      type: Number,
      default: 100
    },
    initialValue: {
      type: Number,
      default: 0
    },
    integer: {
      type: Boolean,
      default: false
    }
  },

  created: function() {
    if (this.initialValue) {
      this.slideValue = this.valueToSlide(this.initialValue);
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

        let mousePosY = event.clientY
          ? event.clientY
          : event.touches[0].clientY;
        let totalSlide = bottom - top;
        let mouseFromTop = mousePosY - top;
        let mousePercentage = (mouseFromTop / totalSlide) * 100;

        if (mousePercentage < 0) {
          mousePercentage = 0;
        }
        if (mousePercentage > 100) {
          mousePercentage = 100;
        }
        this.slideValue = mousePercentage;

        this.$emit("changedValue", {
          val: this.customSlideValue,
          type: this.type
        });
      }
    },
    valueToSlide(value) {
      let totalRange = this.maxValue;
      let valueWithoutMin = value - (this.minValue - 1);
      let percentage = valueWithoutMin / totalRange;

      let backToValue = this.integer
        ? Math.round(percentage * 100)
        : percentage * 100;

      return 100 - backToValue;
    }
  },
  computed: {
    knobPosition() {
      let topValue =
        this.slideValueToInteger < 100 ? this.slideValueToInteger : 100;
      return { bottom: `${topValue}%` };
    },
    slideValueToInteger() {
      return 100 - Math.round(this.slideValue);
    },

    customSlideValue() {
      let { maxValue, minValue } = this;
      let totalRange = maxValue - minValue;
      let percentage = totalRange / 100;
      let totalCustomValue = percentage * this.slideValueToInteger + minValue;

      let totalCustomValueRounded = Math.round(totalCustomValue * 10) / 10;

      return this.integer
        ? Math.round(totalCustomValueRounded)
        : totalCustomValueRounded;
    }
  }
};
</script>
<style lang="scss">
$hagridGreen: #54bb5a;
$yellow: #d9d283;

.type {
  color: white;
  display: block;
  margin-top: 10px;
  text-align: center;
  text-transform: uppercase;
  color: $yellow;
  position: absolute;
  white-space: pre-wrap;
}
.value {
  color: $yellow;
}

.slider-wrapper {
  height: 100%;
  position: relative;
  background: transparent;
  min-width: 40%;
  max-height: 100%;
}
.slider {
  height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  z-index: -2;
  min-width: 60px;

  &__track {
    background: $hagridGreen;
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
