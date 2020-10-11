<template>
  <div class="tv__buttons">
    <span class="tv__divider"></span>
    <div class="tv__wrapper">
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
              class="tv-button__btn"
              :selected="selectedWaveform === wave"
          /></TvButton>
        </div>
      </div>
    </div>
    <span class="tv__divider"></span>
    <div class="tv__wrapper">
      <div
        v-for="(tvButton, index) in tvButtons"
        :key="index"
        class="tv__button"
      >
        <TvButton>
          <component
            v-bind:is="tvButton"
            :selected="selectedTvButton === tvButton"
            class="tv-button__btn"
          />
        </TvButton>
      </div>
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
import clearGrid from "./waves/clearGrid";
import joyStick from "./waves/joyStick";
import portal from "./waves/portal";
import arrow from "./waves/arrow";
export default {
  name: "TvButtonsComponent",
  data() {
    return {
      waves: ["sine", "square", "sawtooth", "triangle"],
      selectedWaveform: "sawtooth",
      selectedTvButton: "",
      tvButtons: ["clearGrid", "joyStick", "portal", "arrow"]
    };
  },
  components: {
    TvButton,
    sine,
    sawtooth,
    square,
    triangle,
    clearGrid,
    joyStick,
    portal,
    arrow
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
  &__divider {
    width: 100%;

    height: 5%;
    transform: skew(-45deg);
    /* background: white; */
    background: rgb(66, 84, 148);
  }
  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    margin-right: 7%;
    margin-top: 4%;
  }
}
</style>