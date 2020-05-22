<template>
  <div class="wave">
    <component v-bind:is="waveForm" class="wave__btn" :selectedWaveForm="selectedWaveForm" />
  </div>
</template>

<script>
import sine from "./waves/sine.vue";
import sawtooth from "./waves/sawtooth.vue";
import square from "./waves/square.vue";
import triangle from "./waves/triangle.vue";
export default {
  name: "WaveComponent",
  props: {
    waveForm: {
      type: String,
      default: "sine"
    },
    selectedWaveForm: {
      type: Boolean,
      default: false
    }
  },

  components: {
    sine,
    sawtooth,
    square,
    triangle
  }
};
</script>
<style lang="scss">
$hagridGreen: #54bb5a;
$blue: rgb(141, 223, 232);
$yellow: #d9d283;

.wave {
  display: flex;
  justify-content: center;

  &__btn {
    height: 70px;
    width: 70px;
    height: 100%;
    width: 23%;
    background: $hagridGreen;
    border-radius: 10%;
    box-sizing: border-box;
  }
}
</style>