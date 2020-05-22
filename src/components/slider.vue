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
    <span class="type">
      {{ type }}
      <span class="value">{{ slideValueForType }}</span>
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
        this.$emit("changedValue", {
          val: this.slideValueForType,
          type: this.type
        });
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
      let fullRange = this.slideValueToInteger * 2;

      return 250 - fullRange;
    },
    slideValueToReverb() {
      let bottomUp = 100 - this.slideValueToInteger;
      console.log(this.slideValueToInteger);

      let rounded = Math.round(bottomUp / 10);
      let percentage = rounded / 10;
      return percentage;
    },
    slideValueForType() {
      let val = "";
      switch (this.type) {
        case "reverb":
          val = this.slideValueToReverb;
          break;
        case "bpm":
          val = this.slideValueToBpm;
      }
      return val;
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
}
.value {
  color: $yellow;
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
