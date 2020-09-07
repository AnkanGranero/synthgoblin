<template>
  <div class="midi-sliders">
    <div class="slot-container">
      <Slider
        v-for="(slide, index) in values"
        :key="index"
        v-bind="slide"
        @changedValue="handleChange"
      />
    </div>
  </div>
</template>

<script>
import Slider from "../Slider/Slider";
import { changeMidiValue } from "../../midi-service/midiService";

export default {
  name: "SliderContainer",
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Slider
  },
  methods: {
    handleChange(payload) {
      changeMidiValue(payload);
    }
  }
};
</script>
<style lang="scss">
$medium: 768px;

.midi-sliders {
  display: flex;
  height: 60%;
  margin-top: 10%;
  margin-bottom: 30%;
  justify-content: space-around;
  flex-direction: column;
}
.slot-container {
  display: flex;
  flex-grow: 3;
  justify-content: space-around;
  /* margin-top: 15%; */
}
/* .btn-wrapper {
  flex-grow: 1;
  margin-top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
} */
</style>