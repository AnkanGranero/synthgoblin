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
        <img src="./assets/kugghjul.svg" class="tv__large-button" alt />
        <div class="tv__buttons">
          <div v-for="(wave,index) in waves" :key="index">
            <button class="tv__btn">
              <img class="tv__image" :src="waveImg(wave)" alt />
            </button>
          </div>
        </div>
      </div>
      <div class="tv__middle">
        <GridLayout :styling="styling" :allScales="allScales" ref="gridLayout" />
      </div>
      <div class="tv__right">
        <img src="./assets/play.svg" class="tv__large-button" alt="play button" @click="play" />
        <slider />
      </div>
      <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
    </div>
    <div class="footer">
      <p class="footer__signature">made by Andreas Granér</p>
    </div>
  </div>
</template>

<script>
import GridLayout from "./components/GridLayout";
/* import Triangle from "./components/Triangle"; */
import Modal from "./components/Modal";
import Overlay from "./components/Overlay";
import * as Tone from "tone";
import { mapState } from "vuex";
import slider from "./components/slider";
/* import colorStyling from "./helpers/colorFunctions.js";
 */

const synth = new Tone.Synth({
  oscillator: {
    type: "square",
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
    /*     Triangle, */
    slider,
    Modal,
    Overlay
  },
  data() {
    return {
      styling: "classic",
      /*   scale: [1, 2, 2, 2, 1, 2, 2], */
      scale: [4, 3, 4, 1],
      intervals: "",
      allScales: [],
      modalOpen: false,
      waves: ["sinus", "square", "sawtooth", "triangle"]
      /*       colorCenter: { x: 10, y: 10 }
       */
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
    }
    prepare();
  },
  methods: {
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
      Tone.Transport.stop();
      this.$store.commit("changeIsPlayingState", true);
      //gör en check om vi redan spelar
      let firstArrowRef = await this.$store.getters.getArrowRefs[0];
      this.$store.dispatch("setPlayingDiv", firstArrowRef);
      Tone.Transport.scheduleRepeat(this.repeat, "8n");
      Tone.Transport.bpm.value = 300;
      Tone.Transport.start();
    },
    repeat(time) {
      let { x, y, refName, direction } = this.playingDiv;

      /*       this.colorCenter = { x, y };
       */ let gridRefs = this.$refs.gridLayout.$refs;
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
        Tone.Transport.stop();
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
    ...mapState(["playingDiv"]),
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
@font-face {
  font-family: "nintendo";
  src: url("./assets/fonts/press_start.ttf");
}
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");
//så småningom byta font till smoothare utstickande bitar
$square: 6.666666666666667%;
$background: #54bb5a;
$yellow: #d9d283;
$green: #368a3c;
/* .overlay {
  height: 100vh;
  z-index: -3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  position: relative;
} */

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
  background: $background;
}
body {
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: $background;
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
  margin: 0 0 7% 0;
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
  }
  &__leaf {
    height: 300px;
    position: absolute;
    /*  top: 8rem;
    right: 16rem; */
    bottom: -57%;
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
    background: $background;
    border: 12px solid $background;
    border-radius: 10%;
    &:hover {
      background: $yellow;
      border: 12px solid $yellow;
    }
  }
}

.footer {
  width: 80%;
  text-align: right;
  &__signature {
    margin-top: 1%;
    font-size: 1rem;
  }
}
</style>





