<template>
  <div class="tv__buttons">
    <div v-for="wave in waves" :key="wave" @click="handleClick(wave)">
      <div>
        <TvButton :value="wave" alt="waveform select button">
          <component
            v-bind:is="wave"
            class="wave__btn"
            :selected="selectedWaveform === wave"
        /></TvButton>
      </div>
    </div>
    <div
      v-for="(tvButton, index) in tvButtons"
      :key="index"
      @click="clickedOnTvButton(tvButton)"
    >
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
export default {
  name: "TvButtonsComponent",
  data() {
    return {
      waves: ["sine", "square", "sawtooth", "triangle"],
      selectedWaveform: "sawtooth",
      selectedTvButton: "",
      tvButtons: ["deleteAllArrows"]
    };
  },
  components: {
    TvButton,
    sine,
    sawtooth,
    square,
    triangle,
    deleteAllArrows
  },
  methods: {
    changeWave,
    handleClick(wave) {
      this.selectedWaveform = wave;
      this.changeWave(wave);
    },
    clickedOnTvButton(tvButton) {
      if (tvButton === "deleteAllArrows") {
        this.$store.commit("clearAllArrowRefs");
      }
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
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
}
</style>