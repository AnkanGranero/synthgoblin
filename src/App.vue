<template>
  <div id="hagrid">
    <Modal v-if="modalOpen" @modalEmit="modalEventHandler" />

    <SecretModal @changeGridSize="changeGridSize" />
    <div class="tv-wrapper">
      <div class="header">
        <div class="header__empty"></div>
        <div class="header__center">
          <h1 class="header__h1">Hagrid</h1>
          <p class="header__sub">grid sequencer</p>
        </div>
        <img class="header__leaf" src="./assets/blad.svg" alt="leaf" />
      </div>
      <div class="tv">
        <div class="tv__top-mobile">
          <IconPlay class="tv__large-button" @clicked="play" />
          <IconInfo class="tv__large-button" @clicked="openModal" />
        </div>
        <div class="tv__left">
          <IconInfo class="tv__large-button" @clicked="openModal" />

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
          <button class="tv__clear" @click="clearAllArrows" />
        </div>
        <div class="tv__middle">
          <GridLayout :styling="styling" ref="gridLayout" @clickedSquare="playNote" />
        </div>
        <div class="tv__right">
          <IconPlay class="tv__large-button" @clicked="play" />
          <div class="sliderContainer">
            <Slider @changedValue="changedSliderValue" type="bpm" :maxValue="250" :minValue="50" />
            <Slider @changedValue="changedSliderValue" type="reverb" :maxValue="1" :minValue="0" />
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
import {
  Modal,
  Overlay,
  Slider,
  GridLayout,
  WaveComponent,
  SecretModal
} from "./components/index.js";
import { createAllArpeggios } from "./utils/pitchCalculations";

import IconInfo from "./components/IconInfo";
import IconPlay from "./components/IconPlay";

import * as Tone from "tone";
import { mapState } from "vuex";

const reverb = new Tone.Reverb({
  decay: 5,
  wet: 0.3,
  preDelay: 0.2
}).toMaster();
var filter = new Tone.Filter({
  type: "bandpass",
  Q: 120
}).toMaster();
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
    WaveComponent,
    SecretModal
  },
  created: function() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.$store.commit("isMobile");
      this.$store.dispatch("changeGridSize", { x: 6, y: 8 });
    }
  },
  data() {
    return {
      styling: "classic",
      intervals: "",
      modalOpen: false,
      waves: ["sine", "square", "sawtooth", "triangle"],
      bpm: 150,
      selectedWaveform: "sawtooth"
    };
  },
  mounted() {
    this.createNewArpeggios();
    async function prepare() {
      await reverb.generate();

      synth.connect(reverb);
      synth.connect(filter);
    }
    prepare();
  },
  methods: {
    playNote(payload) {
      if (this.isPlaying) return;
      let { x, y } = payload;
      //we need to subtract one since the coordinates starts on 1
      //and the allArpeggios arr start at index 0
      let note = this.allArpeggios[x - 1][y - 1];
      synth.triggerAttackRelease(note, "8n");
    },
    changeWave(val) {
      synth.oscillator.type = val;
      this.selectedWaveform = val;
    },
    changedSliderValue({ val, type }) {
      if (type === "bpm") {
        this.bpm = val;
        Tone.Transport.bpm.value = val;
      }
      if (type === "reverb") {
        reverb.wet.value = val;
      }
    },
    changeGridSize(gridSize) {
      this.$store.dispatch("changeGridSize", gridSize);
      this.createNewArpeggios();
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

    createNewArpeggios() {
      let newArpeggios = createAllArpeggios(
        this.arpeggio,
        this.gridSize,
        this.angle
      );
      this.$store.dispatch("createAllArpeggios", newArpeggios);
    },

    closeOverlay() {
      this.modalOpen = false;
    },
    modalEventHandler(payload) {
      switch (payload) {
        case "closeModal":
          this.modalOpen = false;
          break;
        case "createAllArs":
          this.createNewArpeggios();
          break;
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
        //we need to subtract one since the coordinates starts on 1
        //and the allArpeggios arr start at index 0
        let note = this.allArpeggios[x - 1][y - 1];

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
    },
    clearAllArrows() {
      this.$store.dispatch("removeAllArrowRefs");
    }
  },
  computed: {
    ...mapState(["playingDiv", "isPlaying", "allArpeggios", "angle"]),
    gridSize() {
      return this.$store.getters.getGridSize;
    },
    overlayVisible() {
      return this.modalOpen;
    },
    arpeggio() {
      return this.$store.getters.getArpeggio;
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
<style lang="scss" >
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");
//så småningom byta font till smoothare utstickande bitar
$square: 6.666666666666667%;
$hagridGreen: #54bb5a;
$blue: rgb(141, 223, 232);
$yellow: #d9d283;
$leafGreen: #368a3c;
$medium: 768px;

#hagrid {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  box-sizing: border-box;
  display: block;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media only screen and (min-width: $medium) {
    display: flex;
    height: 146%;
  }
}
html {
  font-size: 10px;
  @media only screen and (min-width: 768px) {
    font-size: 10px;
  }
  @media only screen and (min-width: 1400px) {
    font-size: 14px;
  }
  @media only screen and (min-width: 1640px) {
    font-size: 16px;
  }
  @media only screen and (min-width: 2000px) {
    font-size: 19px;
  }
  @media only screen and (min-width: 2300px) {
    font-size: 21px;
  }
  @media only screen and (min-width: 2560px) {
    font-size: 23px;
  }
}

body {
  background: #54bb5a;
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
  font-family: "Open Sans", sans-serif;
}

.tv-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  @media only screen and (min-width: $medium) {
    height: 85%;
    margin: 0 14%;
  }

  .header {
    display: none;
    @media only screen and (min-width: $medium) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      position: relative;
      justify-content: center;
      margin: 5% 0;
      margin-bottom: 13%;
    }

    /*    position: absolute;
    left: 33%;
    width: 33%; */

    /*  margin: 0 0 6% 0; */

    &__h1 {
      color: #d9d283;
      margin: 0;
      /* font-size: 200px; */
      /*     font-size: 13rem; */

      letter-spacing: -0.4rem;
      line-height: 0.8;
      font-size: 12.5vw;
      font-size: 12.9rem;
      /*       font-size: 4.4rem;
      @media only screen and (min-width: 375px) {
        font-size: 5.1rem;
      }
      @media only screen and (min-width: 425px) {
        font-size: 5.7rem;
      }
      @media only screen and (min-width: $medium) {
        font-size: 12.5vw;
      } */
    }
    &__sub {
      margin: 0;
      padding: 0;
      top: -57px;
      left: 13px;
      margin-left: 2%;
      font-size: 1.7vw;
    }
    &__leaf {
      display: none;
      @media only screen and (min-width: 768px) {
        display: unset;
        height: 19vw;
        position: absolute;
        bottom: 0;
        top: 56%;
        right: -11%;
      }
      @media only screen and (min-width: 1024px) {
        right: 0;
      }
    }
    &__middle {
      width: 50%;
    }
    &__left,
    &__leaf {
      flex-grow: 1;
    }
  }
}

.tv {
  background: black;
  width: 100%;
  border-radius: 10px;
  align-content: center;
  display: flex;
  min-height: 100%;

  justify-content: space-between;
  /*   height: 100%;
  min-height: 46%; */
  height: 100%;
  flex-direction: column;
  position: absolute;

  @media only screen and (min-width: $medium) {
    position: unset;
    min-height: unset;

    padding: 12.5% 0;
    height: unset;
    width: 80%;
    width: 100%;
    flex-direction: row;
  }

  &__top-mobile {
    display: flex;
    justify-content: space-evenly;
    padding: 10% 0 5%;
    @media only screen and (min-width: $medium) {
      display: none;
    }
  }

  &__large-button {
    @media only screen and (min-width: $medium) {
      width: 50%;
      margin-bottom: 19%;
    }
  }
  &__btn-wrapper {
    display: flex;
    justify-content: center;
  }

  &__left {
    display: none;
    position: relative;
    @media only screen and (min-width: $medium) {
      display: flex;
      align-items: center;
      flex-basis: 0;
      justify-content: center;
      flex-grow: 1;
      flex-direction: column;
    }
    /*   min-width: 271px; */
  }
  &__right {
    display: none;

    @media only screen and (min-width: $medium) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-basis: 0;
      flex-grow: 1;
      flex-direction: column;
    }
    .sliderContainer {
      display: none;
      @media only screen and (min-width: $medium) {
        display: flex;
        height: 100%;
        justify-content: space-around;
        width: 48%;
      }
    }
  }
  &__circle {
    background: white;
    height: 10vw;
    width: 10vw;
    border-radius: 100%;
  }
  &__middle {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 50%;
    min-width: 100%;
    padding: 5%;
    box-sizing: border-box;
    position: relative;

    @media only screen and (min-width: $medium) {
      padding: unset;
      width: 50%;
      height: unset;
      min-height: unset;
      min-width: unset;
    }
  }

  &__buttons {
    display: none;

    @media only screen and (min-width: $medium) {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  &__btn {
    margin: 5%;
  }
  &__clear {
    background: red;
    border-radius: 100%;
    height: 20px;
    width: 20px;

    position: absolute;
    bottom: -70px;
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





