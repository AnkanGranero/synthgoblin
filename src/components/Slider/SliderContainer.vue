<template>
  <div class="slider-container">
    <div class="slot-container">
      <Slider v-for="(slide, index) in values" :key="index" v-bind="slide" />
    </div>
  </div>
</template>

<script>
import Slider from "../Slider/Slider";

export default {
  name: "SliderContainer",
  props: {
    values: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Slider,
  },
};
</script>
<style lang="scss">
$medium: 768px;

.slider-container {
  position: relative;
  display: flex;
  height: 60%;
  margin-top: 10%;
  margin-bottom: 30%;
  justify-content: space-around;
  flex-direction: column;
}
.slot-container {
  height: 100%;
  display: flex;
  flex-grow: 3;
  justify-content: space-around;
}
</style>