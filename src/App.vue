<template>
  <div id="hagrid">
    <!--     <div class="header">
      <button class="header__btn" @click="play">PLAY</button>
    </div>-->
    <Modal v-if="modalOpen" @modalEmit="modalEventHandler" />
    <div class="tv-wrapper">
      <div class="header">
        <div class="header__empty"></div>
        <div class="header__center">
          <h1 class="header__h1" @click="openModal">Hagrid</h1>
          <p class="header__sub">grid sequencer</p>
        </div>
        <img class="header__leaf" src="./assets/blad.svg" alt="leaf" />
      </div>
      <div class="tv">
        <div class="tv__left">
          <IconInfo class="tv__large-button" />

          <div class="tv__buttons">
            <div v-for="(wave,index) in waves" :key="index" @click="changeWave(wave)">
              <div>
                <WaveComponent
                  @click="changeWave(wave)"
                  :waveForm="wave"
                  alt="waveform select button"
                  :selectedWaveForm="(selectedWaveform == wave)"
                ></WaveComponent>
              </div>
            </div>
          </div>
        </div>
        <div class="tv__middle">
          <GridLayout :styling="styling" :allScales="allScales" ref="gridLayout" />
        </div>
        <div class="tv__right">
          <IconPlay class="tv__large-button" @clicked="play" />
          <div class="sliderContainer">
            <Slider @changedValue="changedSliderValue" value="BPM" />
            <Slider @changedValue="changedSliderValue" value="Filter" />
          </div>
        </div>
        <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
      </div>
      <div class="footer">
        <p class="footer__signature">made by Andreas Granér</p>
      </div>
    </div>
  </div>
</template>

<script>
/* import Triangle from "./components/Triangle"; */
import {
  Modal,
  Overlay,
  Slider,
  GridLayout,
  WaveComponent
} from "./components/index.js";

import IconInfo from "./components/IconInfo";
import IconPlay from "./components/IconPlay";

import * as Tone from "tone";
import { mapState } from "vuex";
/* import colorStyling from "./helpers/colorFunctions.js";
 */
/* var lowPassFreq = new Tone.Signal(300, Tone.Frequency);
 */

const lowPass = new Tone.Filter(50, "lowpass").toMaster();
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
    IconPlay,
    WaveComponent
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
      synth.connect(lowPass);
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
      return require(`./assets/waves/${wave}.svg`);
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
$blue: rgb(141, 223, 232);
$yellow: #d9d283;
$leafGreen: #368a3c;

#hagrid {
  /*   z-index: -3;
 */
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  padding: 0 14%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: $hagridGreen;
  width: 100%;
  height: 146%;
}
html {
  min-height: 100%;
  min-width: 100%;
}
body {
  height: 100%;
  width: 100%;
  min-height: 100%;
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: $hagridGreen;
  margin: 0;

  font-size: 1.5rem;
  letter-spacing: -1px;
}
* {
  font-family: "Open Sans", sans-serif;
  /*   font-family: "Roboto", sans-serif; */
}

.tv-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;

  .header {
    display: flex;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    /* flex-direction: column; */
    position: relative;
    /*     position: absolute; */
    justify-content: center;
    margin-bottom: 10%;
    margin-top: 6%;
    /*    position: absolute;
    left: 33%;
    width: 33%; */

    /*  margin: 0 0 6% 0; */

    &__h1 {
      color: #d9d283;
      margin: 0;
      /* font-size: 200px; */
      /*     font-size: 13rem; */
      font-size: 12.5vw;
      letter-spacing: -0.4rem;
      line-height: 0.8;
    }
    &__sub {
      margin: 0;
      padding: 0;
      top: -57px;
      left: 13px;
      margin-left: 2%;
      /*  font-size: 1.7rem; */
      font-size: 1.7vw;
    }
    &__leaf {
      /*  height: 300px; */
      height: 19vw;
      position: absolute;
      right: 0;
      bottom: 0;
      top: 56%;

      /*     position: absolute;

    bottom: -49%;
    right: -39%; */
    }
    &__middle {
      flex-grow: 4;
    }
    &__left,
    &__leaf {
      flex-grow: 1;
    }
  }
}

.tv {
  background: black;
  width: 80%;
  border-radius: 10px;
  align-content: center;
  display: flex;

  justify-content: space-between;
  height: 100%;
  min-height: 46%;
  padding: 12.5% 0;
  @media only screen and (min-width: 768px) {
    width: 100%;
    min-width: 90vh;
  }

  &__large-button {
    /*     align-self: flex-start; */

    width: 150px;
    width: 50%;
    margin-bottom: 19%;
    /*   background: $hagridGreen;
    border-radius: 20%; */
  }
  &__btn-wrapper {
    display: flex;
    justify-content: center;
  }

  &__left {
    flex-grow: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-basis: 0;
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
    flex-basis: 0;

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
    margin: 5%;
  }
}

.footer {
  width: 100%;
  text-align: right;
  &__signature {
    margin: 0.5%;
    font-size: 0.8rem;
  }
}
</style>





