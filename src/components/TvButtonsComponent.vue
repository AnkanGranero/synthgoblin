<template>
  <div class="tv__buttons">
    <div
      v-for="wave in waves"
      :key="wave"
      @click="handleClick(wave)"
      class="tv__button"
    >
      <div>
        <TvButton :value="wave" alt="waveform select button">
          <component
            v-bind:is="wave"
            class="wave__btn"
            :selected="selectedWaveform === wave"
        /></TvButton>
      </div>
    </div>
    <div v-for="(tvButton, index) in tvButtons" :key="index" class="tv__button">
      <TvButton>
        <component
          v-bind:is="tvButton"
          class="wave__btn"
          :selected="selectedTvButton === tvButton"
        />
      </TvButton>
    </div>
  </div>
</template>

<script>
import TvButton from "./TvButton";
import { changeWave } from "../playStuff/playStuff";
import sine from "./waves/sine.vue";
import sawtooth from "./waves/sawtooth.vue";
import square from "./waves/square.vue";
import triangle from "./waves/triangle.vue";
import deleteAllArrows from "./waves/deleteAllArrows";
import joyStick from "./waves/joyStick";
import portal from "./waves/portal";
import mute from "./waves/mute";
export default {
  name: "TvButtonsComponent",
  data() {
    return {
      waves: ["sine", "square", "sawtooth", "triangle"],
      selectedWaveform: "sawtooth",
      selectedTvButton: "",
      tvButtons: ["deleteAllArrows", "joyStick", "portal", "mute"]
    };
  },
  components: {
    TvButton,
    sine,
    sawtooth,
    square,
    triangle,
    deleteAllArrows,
    joyStick,
    portal,
    mute
  },
  methods: {
    changeWave,
    handleClick(wave) {
      this.selectedWaveform = wave;
      this.changeWave(wave);
    }
  }
};
</script>

<style lang="scss">
.tv {
  &__buttons {
    display: none;

    @media only screen and (min-width: $ipad) {
      height: 100%;
      width: 61%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  &__button {
    flex: 0 50%;
    margin-bottom: 2%;
  }
}
</style>