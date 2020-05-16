<template>
  <div id="hagrid">
    <div class="header">
      <h1 class="header__h1" @click="openModal">Hagrid</h1>
      <p class="header__sub">grid sequencer</p>
      <img class="header__leaf" src="./assets/blad.svg" alt="leaf" />
    </div>

    <!--     <div class="header">
      <button class="header__btn" @click="play">PLAY</button>
    </div>-->
    <Modal v-if="modalOpen" @modalEmit="modalEventHandler" />
    <div class="tv">
      <div class="tv__left">
        <IconInfo class="tv__large-button" />

        <div class="tv__buttons">
          <div v-for="(wave,index) in waves" :key="index" @click="changeWave(wave)">
            <button class="tv__btn">
              <img
                class="tv__image"
                :src="waveImg(wave)"
                alt="waveform select button"
                :class="{ 'tv__image--active': selectedWaveform === wave}"
              />
            </button>
          </div>
        </div>
      </div>
      <div class="tv__middle">
        <GridLayout :styling="styling" :allScales="allScales" ref="gridLayout" />
      </div>
      <div class="tv__right">
        <IconPlay class="tv__large-button" @clicked="play" />
        <div class="sliderContainer">
          <Slider @changedValue="changedSliderValue" value="Bpm" />
          <Slider @changedValue="changedSliderValue" value="Filter" />
        </div>
      </div>
      <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
    </div>
    <div class="footer">
      <p class="footer__signature">made by Andreas Granér</p>
    </div>
  </div>
</template>

<script>
/* import Triangle from "./components/Triangle"; */
import { Modal, Overlay, Slider, GridLayout } from "./components/index.js";

import IconInfo from "./components/IconInfo";
import IconPlay from "./components/IconPlay";

import * as Tone from "tone";
import { mapState } from "vuex";
/* import colorStyling from "./helpers/colorFunctions.js";
 */

const synth = new Tone.Synth({
  oscillator: {
    type: "sawtooth",
    modulationFrequency: 0.2
  },

  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
  }
});

export default {
  name: "App",
  components: {
    GridLayout,
    Slider,
    Modal,
    Overlay,
    IconInfo,
    IconPlay
  },
  data() {
    return {
      styling: "classic",
      /*   scale: [1, 2, 2, 2, 1, 2, 2], */
      scale: [4, 3, 4, 1],
      intervals: "",
      allScales: [],
      modalOpen: false,
      waves: ["sine", "square", "sawtooth", "triangle"],
      bpm: 150,
      selectedWaveform: "sawtooth"
    };
  },
  mounted() {
    this.createAllPitchArrs();
    async function prepare() {
      /* ; */
      const reverb = new Tone.Reverb({
        decay: 5,
        wet: 0.3,
        preDelay: 0.2
      }).toMaster();
      await reverb.generate();

      /*       var pingPong = new Tone.PingPongDelay("4n", 0.2).toMaster(); */
      synth.connect(reverb);
      console.log(synth);
    }
    prepare();
  },
  methods: {
    changeWave(val) {
      synth.oscillator.type = val;
      this.selectedWaveform = val;
    },
    changedSliderValue(val) {
      this.bpm = val;
      Tone.Transport.bpm.value = val;
    },
    waveImg(wave) {
      return require(`./assets/${wave}.svg`);
    },
    openModal() {
      this.modalOpen = true;
    },

    changeTheme(styling) {
      this.styling = styling;
      this.modalOpen = false;
    },
    createScale() {
      if (this.intervals) {
        this.scale = this.intervals.split("");
        this.createAllPitchArrs();
      }
      this.modalOpen = false;
    },
    createAllPitchArrs() {
      let allArrs = [];
      let startKey = 0;

      for (let i = 0; i <= 15; i++) {
        let arr = this.createPitchArr(startKey);
        allArrs.push(arr);
        let interval = parseInt(this.scale[i % this.scale.length], 10);
        startKey += interval;
      }
      this.allScales = allArrs;
    },
    createPitchArr(startKey) {
      let arr = [];
      let pianoKey = startKey;

      for (let i = 0; i <= 15; i++) {
        arr.push(this.hertzCalculator(pianoKey));
        let interval = parseInt(this.scale[i % this.scale.length], 10);
        pianoKey += interval;
      }
      return arr;
    },
    hertzCalculator(n) {
      return Math.pow(2, n / 12) * 55;
    },
    closeOverlay() {
      this.modalOpen = false;
    },
    modalEventHandler(payload) {
      switch (payload) {
        case "closeModal":
          this.modalOpen = false;
      }
    },
    async play() {
      if (this.isPlaying) {
        Tone.Transport.cancel();
        this.$store.dispatch("changeIsPlayingState", false);
        this.$store.dispatch("setPlayingDiv", null);
        return;
      }
      let firstArrowRef = await this.$store.getters.getArrowRefs[0];
      if (!firstArrowRef) {
        return;
      }
      this.$store.dispatch("setPlayingDiv", firstArrowRef);

      this.$store.commit("changeIsPlayingState", true);

      Tone.Transport.scheduleRepeat(this.repeat, "16n");
      Tone.Transport.bpm.value = this.bpm;
      Tone.Transport.start();
    },
    repeat(time) {
      let { x, y, refName, direction } = this.playingDiv;

      let gridRefs = this.$refs.gridLayout.$refs;
      let ref = gridRefs[refName];

      if (ref) {
        ref[0].classList.remove("highlight");

        let isArrow = this.$store.getters.findArrowRef(refName);
        if (isArrow) {
          direction = isArrow.direction;
        }

        let note = this.allScales[x][y];

        synth.triggerAttackRelease(note, "8n", time);

        let nextCoordinates = this.nextCoordinateBasedOnDirection(
          x,
          y,
          direction
        );

        let nextPlayingDivRef = this.getRefFromCoordinates(
          nextCoordinates.x,
          nextCoordinates.y
        );
        this.$store.dispatch("setPlayingDiv", {
          ...nextCoordinates,
          refName: nextPlayingDivRef
        });
        let nextPlayingDiv = gridRefs[nextPlayingDivRef];
        if (nextPlayingDiv) {
          nextPlayingDiv[0].classList.add("highlight");
        }
      } else {
        console.log("out of bounds");

        Tone.Transport.cancel();
        this.$store.commit("changeIsPlayingState", false);
      }
    },
    getRefFromCoordinates(x, y) {
      return `r${x}-${y}`;
    },
    nextCoordinateBasedOnDirection(x, y, direction) {
      switch (direction) {
        case "down":
          y += 1;
          break;
        case "right":
          x += 1;
          break;
        case "left":
          x -= 1;
          break;
        case "up":
          y -= 1;
          break;
      }

      return { x, y, direction };
    }
    /*     findArrowRef(x, y) {
      let refName = this.getRefFromCoordinates(x, y);
      return this.arrowRefs.find(arrowRef => arrowRef.name === refName);
    } */
  },
  computed: {
    ...mapState(["playingDiv", "isPlaying"]),
    overlayVisible() {
      return this.modalOpen;
    },
    backgroundColors() {
      if (this.$store.state.isPlaying) {
        return this.$store.state.backgroundColors;
      } else {
        return {
          background: "white"
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");
//så småningom byta font till smoothare utstickande bitar
$square: 6.666666666666667%;
$hagridGreen: #54bb5a;
$yellow: #d9d283;
$leafGreen: #368a3c;
$blue: rgb(141, 223, 232);

#hagrid {
  /*   z-index: -3;
 */
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  padding: 0 5%;
  display: flex;
  flex-direction: column;
  background: $hagridGreen;
}
body {
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: $hagridGreen;
  margin: 0;
  color: rgb(60, 58, 58);
  font-size: 1.5rem;
  letter-spacing: -1px;
}
* {
  font-family: "Open Sans", sans-serif;

  /*   font-family: "Roboto", sans-serif; */
}

.header {
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 0 6% 0;
  &__h1 {
    color: #d9d283;
    margin: 0;
    /* font-size: 200px; */
    font-size: 13rem;
    letter-spacing: -0.4rem;
  }
  &__sub {
    margin: 0;
    padding: 0;
    position: relative;
    top: -57px;
    left: 13px;
    font-size: 1.7rem;
  }
  &__leaf {
    height: 300px;
    position: absolute;
    /*  top: 8rem;
    right: 16rem; */
    bottom: -49%;
    right: -39%;
  }
}

.tv {
  background: black;
  width: 80%;
  border-radius: 10px;
  align-content: center;
  display: flex;

  justify-content: space-between;

  padding: 10% 0;
  @media only screen and (min-width: 768px) {
    height: 50vw;
  }

  &__large-button {
    /*     align-self: flex-start; */

    width: 150px;
    margin-bottom: 20%;
    /*   background: $hagridGreen;
    border-radius: 20%; */
  }

  &__left {
    flex-grow: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  &__circle {
    background: white;
    height: 10vw;
    width: 10vw;
    border-radius: 100%;
  }
  &__middle {
    flex-grow: 4;
    display: flex;
    justify-content: center;
    max-width: 606px;
    /*     padding: 10px;
    border: 2px solid rgb(133, 130, 130); */
  }
  &__right {
    flex-grow: 1;
    display: flex;
    align-items: center;
    flex-direction: column;

    .sliderContainer {
      display: flex;
      height: 100%;
      justify-content: space-around;
    }
  }
  &__buttons {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__btn {
    background: transparent;
    border: none;
    outline: none;
  }
  &__image {
    height: 70px;
    width: 70px;
    background: $hagridGreen;
    border: 12px solid $hagridGreen;
    border-radius: 10%;
    &--active {
      background: $yellow !important;
      border: 12px solid $yellow !important;
    }
    &:hover {
      background: $blue;
      border: 12px solid $blue;
    }
  }
}

.footer {
  width: 80%;
  text-align: right;
  &__signature {
    margin: 0.5%;
    font-size: 0.8rem;
  }
}
</style>





