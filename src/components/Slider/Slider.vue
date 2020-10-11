<template>
  <div class="slider-wrapper">
    <div
      class="slider"
      @mouseleave="clicked = false"
      @mousedown="mouseHandler"
      @mouseup="clicked = false"
      @mousemove="mouseHandler"
      @touchstart="prevent.default(), (clicked = true)"
      @touchmove="mouseHandler"
      @touchend="clicked = false"
      @touchcancel="clicked = false"
      ref="slider"
    >
      <div class="slider__track"></div>
      <div class="slider__knob" :style="knobPosition"></div>
    </div>
    <div class="slider-wrapper__type" :class="{ 'large-text': largeText }">
      {{ name }}
      <span class="slider-wrapper__value">{{ customSlideValue }}</span>
    </div>
  </div>
</template>
<script>
import {
  changeMidiNoteLength,
  changeMidiNoteVelocity
} from "../../midi-service/midiService";
import {
  changeBpm,
  changeReverb,
  changeVolume
} from "../../playStuff/playStuff";

export default {
  name: "sliders",
  data() {
    return {
      slideValue: 50,
      clicked: false
    };
  },

  props: {
    name: {
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
    },
    largeText: {
      type: Boolean,
      default: true
    },
    valueType: {
      type: String,
      required: true
    },
    method: {
      type: String,
      default: ""
    },
    action: {
      type: String
    }
  },

  created: function() {
    if (this.valueType === "GridSize") {
      let gridSize = this.$store.getters.getGridSize;
      this.slideValue = this.valueToSlide(gridSize[this.name]);
      return;
    } else if (this.initialValue) {
      this.slideValue = this.valueToSlide(this.initialValue);
    }
  },
  methods: {
    changeMidiNoteLength,
    changeMidiNoteVelocity,
    changeBpm,
    changeReverb,
    changeVolume,
    mouseHandler(event) {
      event.preventDefault();

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

        /*       this.$emit("changedValue", {
          val: this.customSlideValue,
          name: this.name
        }); */
        this.handleChange();
      }
    },
    handleChange() {
      if (this.method) {
        this[this.method](this.customSlideValue);
      } else if (this.action) {
        const actionValues = {};
        actionValues[this.name] = this.customSlideValue;
        this.$store.dispatch(this.action, actionValues);
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

.slider-wrapper {
  height: 100%;
  position: relative;
  background: transparent;
  min-width: 40%;
  max-height: 100%;
  font-family: "Source Sans Pro", sans-serif;

  &__type {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    text-align: center;
    text-transform: uppercase;
    color: $yellow;
    position: absolute;
    width: 100%;
    /*     @media screen and (min-width: 600px) {
      font-size: 15px;
    } */
    font-size: 30px;
    @media screen and (min-width: $ipad) {
      font-size: 15px;
    }
    @media screen and (min-width: $desktop-large) {
      font-size: 30px;
    }
    /*     white-space: pre-wrap; */
  }
}
.large-text {
  font-size: 30px;
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
    background: $light-stroke;
    width: 1px;
    max-width: 5px;
  }

  &__knob {
    background: $yellow;

    height: 4%;
    width: 75%;
    max-width: 60px;
    position: absolute;
    border-radius: 10px;
  }
  /*   &__value {
    width: 100%;
  } */
}
</style>
