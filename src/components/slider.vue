<template>
  <div class="slidecontainer">
    <!--     <span>{{ slideValue }}</span> -->
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
  methods: {
    changeMousePos(event) {
      console.log("mouseEvent", event);
    },
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
      }
    }
  },
  computed: {
    knobPosition() {
      let topValue = this.slideValue < 100 ? this.slideValue : 100;
      return { top: `${topValue}%` };
    }
  }
};
</script>
<style lang="scss">
$background: #54bb5a;
$yellow: #d9d283;

.slidecontainer {
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
    width: 80%;
    background: $yellow;
    height: 10px;
    position: absolute;
    border-radius: 10%;
  }
}
</style>
