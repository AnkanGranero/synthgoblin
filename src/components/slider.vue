<template>
  <div class="slidecontainer">
    <input
      type="range"
      min="2"
      orient="vertical"
      max="100"
      v-model="slideValue"
      class="slidecontainer__slider"
      id="myRange"
      ref="slider"
    />
    <div
      class="slidecontainer__twin"
      @mousedown="mouseHandler"
      @mouseup="mouseHandler"
    >
      <div class="slidecontainer__knob" :style="knobPosition" ref="knob"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "sliders",
  data() {
    return {
      slideValue: 100
    };
  },
  methods: {
    changeMousePos(event) {
      console.log("mouseEvent", event);
    },
    mouseHandler() {
      let ref = this.$refs["knob"];
      console.log("ref", ref);

      ref.style.borderradius = "50%";
    }
  },
  computed: {
    knobPosition() {
      return { top: `${100 - this.slideValue}%` };
    }
  }
};
</script>
<style lang="scss">
.slidecontainer {
  height: 100%;
  display: flex;
  &__slider {
    writing-mode: tb-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    /*     -webkit-appearance: none; */
    height: 100%;
    width: 5px;
    /*    transform: rotate(90deg); */
    margin: 0;
    ::-webkit-slider-runnable-track {
      background: red;
    }
    ::-webkit-slider-thumb {
      background: green;
      width: 100px;
    }
  }
  &__twin {
    height: 100%;
    background: red;
    width: 5px;
  }
  &__knob {
    background: green;
    width: 10px;
    height: 10px;
    position: relative;
  }
}
</style>
