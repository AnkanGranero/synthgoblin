<template>
  <div class="wrapper">
    <div
      class="tv-buttons__buttons"
      :class="'tv-buttons__buttons-' + getColorTheme"
    >
      <span class="tv-buttons__divider"></span>
      <div class="tv-buttons__wrapper" v-if="desktopVersion">
        <div
          v-for="wave in waves"
          :key="wave"
          @click="handleClick(wave)"
          class="tv-buttons__button"
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
      <span class="tv-buttons__divider"></span>
      <div class="tv-buttons__wrapper">
        <div
          v-for="(tvButton, index) in tvButtons"
          :key="index"
          class="tv-buttons__button"
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
    <div class="tv-buttons__buttons-mobile">
      <div
        v-for="(tvButton, index) in mobileTvButtons"
        :key="index"
        class="tv-buttons__button"
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
import arrowOrPortal from "./waves/arrowOrPortal";
import mute from "./waves/mute";
import { mapGetters } from "vuex";
export default {
  name: "TvButtonsComponent",
  data() {
    return {
      waves: ["sine", "square", "sawtooth", "triangle"],
      selectedWaveform: "sawtooth",
      selectedTvButton: "",
      tvButtons: ["portal", "arrow", "clearGrid", "joyStick"],
      mobileTvButtons: ["arrowOrPortal", "clearGrid", "mute"]
    };
  },
  props: {
    desktopVersion: {
      type: Boolean,
      default: true
    }
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
    arrow,
    arrowOrPortal,
    mute
  },
  methods: {
    changeWave,
    handleClick(wave) {
      this.selectedWaveform = wave;
      this.changeWave(wave);
    }
  },
  computed: {
    ...mapGetters(["getColorTheme"])
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
}
.tv-buttons {
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
    &-darkStar {
      width: 50%;

      .tv-buttons__wrapper {
        margin-bottom: 40%;
        margin-top: 10%;
      }
    }

    &-mobile {
      display: flex;
      margin: 5% 0;
      width: 100%;
      @media only screen and (min-width: $ipad) {
        display: none;
      }
    }
  }
  &__button {
    flex: 0 50%;
    @media only screen and(min-width: $ipad ) {
      margin-bottom: 2%;
    }
    cursor: pointer;
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
    /*  margin-right: 7%; */
    margin-top: 4%;
  }
}
</style>