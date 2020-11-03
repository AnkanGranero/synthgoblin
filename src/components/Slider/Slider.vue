<template>
  <div class="slider-wrapper" :class="colorTheme">
    <div
      class="slider"
      @mouseleave="clicked = false"
      @mousedown="mouseHandler"
      @mouseup="clicked = false"
      @mousemove="mouseHandler"
      @touchstart="clicked = true"
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
      sliderValue: this.maxValue / 2,
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
      this.sliderValue = this.valueToSlide(gridSize[this.name]);
      return;
    }
    this.sliderValue = this.valueToSlide(this.initialValue);
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
        this.sliderValue = mousePercentage;

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
      let totalRange = this.maxValue - this.minValue;
      let valueWithoutMin = value - this.minValue;
      let percentage = valueWithoutMin / totalRange;

      let backToValue = this.integer
        ? Math.round(percentage * 100)
        : percentage * 100;

      return 100 - backToValue;
    }
  },
  computed: {
    colorTheme() {
      return this.$store.getters.getColorTheme;
    },
    knobPosition() {
      let topValue =
        this.sliderValueToInteger < 100 ? this.sliderValueToInteger : 100;
      return { bottom: `${topValue}%` };
    },
    sliderValueToInteger() {
      return 100 - Math.round(this.sliderValue);
    },

    customSlideValue() {
      let { maxValue, minValue } = this;
      let totalRange = maxValue - minValue;
      let percentage = totalRange / 100;
      let totalCustomValue = percentage * this.sliderValueToInteger + minValue;

      let totalCustomValueRounded = Math.round(totalCustomValue * 10) / 10;
      return this.integer
        ? Math.round(totalCustomValueRounded)
        : totalCustomValueRounded;
    }
  }
};
</script>
<style lang="scss">
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
  @media screen and (min-width: 1024px) {
    min-width: 60px;
  }

  &__track {
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
.classic {
  .slider__track {
    background: $hagrid-green;
  }
}
.darkStar {
  .slider__track {
    background: $light-stroke;
  }
  .slider__knob {
    background: $hagrid-light;
  }
  .slider-wrapper__type {
    color: $yellowMedium;
  }
}
</style>
