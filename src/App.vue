<template>
  <div id="hagrid">
    <Modal v-if="modalIsOpen" @modalEmit="modalEventHandler" />

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

          <TvButtonsComponent class="tv__buttons" />
        </div>
        <div class="tv__middle">
          <GridLayout
            v-if="tvFinishedLoaded"
            :styling="styling"
            ref="gridLayout"
            @clicked-on-square="playNote"
          />
        </div>
        <div class="tv__right">
          <IconPlay class="tv__large-button" @clicked="play" />
          <div class="sliderContainer">
            <Slider
              :largeText="false"
              name="bpm"
              :max-value="250"
              :min-value="50"
              value-type="Tone"
              method="changeBpm"
            />
            <Slider
              :largeText="false"
              name="reverb"
              :max-value="1"
              :min-value="0"
              value-type="Tone"
              method="changeReverb"
            />
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
  TvButtonsComponent,
  SecretModal
} from "./components/index.js";
import IconInfo from "./components/IconInfo";
import IconPlay from "./components/IconPlay";
import * as Tone from "tone";
import { mapState } from "vuex";
import {
  playThang,
  stopPlaying,
  preparePlayStuff,
  synth
} from "./playStuff/playStuff";
import { midiPlay, midiStop } from "./midi-service/midiService";
import { getAllCachedInfo } from "./utils/cacheMethods";

export default {
  name: "App",
  components: {
    GridLayout,
    Slider,
    Modal,
    Overlay,
    IconInfo,
    IconPlay,
    TvButtonsComponent,
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

      bpm: 150,
      selectedWaveform: "sawtooth",
      tvFinishedLoaded: false,
      manualDirection: "",
      eraseKeyDown: false
    };
  },

  mounted() {
    this.createNewArpeggios();
    this.setupCachedInfo();

    preparePlayStuff();
    window.addEventListener("keyup", e => {
      this.handleKeyUpCommands(e);
    });
    window.addEventListener("keydown", e => {
      this.handleKeyDownCommands(e);
    });
    /*  this.checkLocalStorage(); */
  },
  methods: {
    setupCachedInfo() {
      const cachedInfo = getAllCachedInfo();
      let { arrowRefs, gridSize } = cachedInfo;
      if (arrowRefs) {
        this.$store.dispatch("bulkAddArrowRefs", arrowRefs);
      }
      if (gridSize) {
        this.$store.dispatch("changeGridSize", gridSize);
      }

      this.tvFinishedLoaded = true;
    },
    playNote(payload) {
      if (this.isPlaying || this.directionPickerOpen) return;
      let { x, y } = payload;

      //we need to subtract one since the coordinates starts on 1
      //and the allArpeggios arr start at index 0
      let note = this.allArpeggios[x - 1][y - 1];

      this.midiOutActive
        ? this.midiPlay(note)
        : synth.triggerAttackRelease(note, "8n");
    },

    changeGridSize(gridSize) {
      this.$store.dispatch("changeGridSize", gridSize);
      this.createNewArpeggios();
    },
    openModal() {
      this.$store.dispatch("modalIsOpen", true);
    },

    changeTheme(styling) {
      this.styling = styling;
      this.$store.dispatch("modalIsOpen", false);
    },

    createNewArpeggios() {
      this.$store.dispatch("setAllArpeggios");
    },

    closeOverlay() {
      this.$store.dispatch("modalIsOpen", false);
    },
    modalEventHandler(payload) {
      switch (payload) {
        case "closeModal":
          this.$store.dispatch("modalIsOpen", false);
          break;
        case "createAllArs":
          this.createNewArpeggios();
          break;
      }
    },
    stop() {
      stopPlaying();
      this.$store.dispatch("changeIsPlayingState", false);
      this.$store.dispatch("setPlayingDiv", null);
      this.midiStop();
    },
    async play() {
      if (this.isPlaying) {
        this.stop();
        return;
      }
      let firstArrowRef = await this.$store.getters.getArrowRefs[0];
      if (!firstArrowRef) {
        return;
      }
      this.$store.dispatch("setPlayingDiv", firstArrowRef);
      this.$store.commit("changeIsPlayingState", true);
      playThang(this.repeat, this.bpm);
    },
    repeat(time) {
      let { x, y, refName, direction } = this.playingDiv;

      let gridRefs = this.$refs.gridLayout.$refs;
      let ref = gridRefs[refName];

      if (ref && ref.length && this.isPlaying) {
        ref[0].classList.remove("highlight");

        let isArrow = this.$store.getters.findArrowRef(refName);
        if (this.eraseKeyDown) {
          this.$store.dispatch("removeArrowRef", refName);
        } else if (
          this.writeKeyDown &&
          this.manualDirection &&
          this.manualDirection !== direction
        ) {
          let newPlayingDiv = this.playingDiv;
          newPlayingDiv.direction = this.manualDirection;

          this.$store.dispatch("addArrowRef", this.playingDiv);
        } else if (isArrow) {
          direction = isArrow.direction;
          this.manualDirection = "";
        }

        if (this.manualDirection) {
          direction = this.manualDirection;
        }
        //we need to subtract one since the coordinates starts on 1
        //and the allArpeggios arr start at index 0
        let note = this.allArpeggios[x - 1][y - 1];
        this.midiOutActive
          ? this.midiPlay(note)
          : synth.triggerAttackRelease(note, "8n", time);

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
        if (nextPlayingDiv && nextPlayingDiv.length) {
          nextPlayingDiv[0].classList.add("highlight");
        }
      } else {
        Tone.Transport.cancel();
        this.$store.commit("changeIsPlayingState", false);
        this.midiStop();
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
    handleKeyDownCommands(e) {
      if (this.joystickMode && e.keyCode > 36 && e.keyCode < 41) {
        let direction = e.key.replace("Arrow", "").toLowerCase();
        this.manualDirection = direction;
        e.preventDefault();
      }
      if (e.keyCode === 32) {
        this.play();
      }
      if (e.keyCode === 87) {
        this.writeKeyDown = true;
      }
      if (e.keyCode === 69) {
        this.eraseKeyDown = true;
        e.preventDefault();
      }
    },
    handleKeyUpCommands(e) {
      if (e.keyCode === 69) {
        this.eraseKeyDown = false;
      }
      if (e.keyCode === 87) {
        this.writeKeyDown = false;
      }
    },

    midiPlay,
    midiStop
  },
  computed: {
    ...mapState([
      "playingDiv",
      "isPlaying",
      "allArpeggios",
      "angle",
      "modalIsOpen",
      "joystickMode"
    ]),
    gridSize() {
      return this.$store.getters.getGridSize;
    },
    overlayVisible() {
      return this.modalIsOpen;
    },
    arpeggio() {
      return this.$store.getters.getArpeggio;
    },
    midiOutActive() {
      return this.$store.getters.midiOutActive;
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

  @media only screen and (min-width: $ipad) {
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
  @media only screen and (min-width: $ipad) {
    height: 85%;
    margin: 0 14%;
  }

  .header {
    display: none;
    @media only screen and (min-width: $ipad) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      position: relative;
      justify-content: center;
      margin: 5% 0;
      margin-bottom: 13%;
    }

    &__h1 {
      color: #d9d283;
      margin: 0;
      letter-spacing: -0.4rem;
      line-height: 0.8;
      font-size: 12.5vw;
      font-size: 12.9rem;
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
  height: 100%;
  flex-direction: column;
  position: absolute;

  @media only screen and (min-width: $ipad) {
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
    @media only screen and (min-width: $ipad) {
      display: none;
    }
  }

  &__large-button {
    @media only screen and (min-width: $ipad) {
      width: 50%;
      margin-bottom: 19%;
      cursor: pointer;
    }
  }
  &__btn-wrapper {
    display: flex;
    justify-content: center;
  }

  &__left {
    display: none;
    @media only screen and (min-width: $ipad) {
      display: flex;
      align-items: center;
      flex-basis: 0;
      justify-content: center;
      flex-grow: 1;
      flex-direction: column;
    }
  }
  &__right {
    display: none;

    @media only screen and (min-width: $ipad) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-basis: 0;
      flex-grow: 1;
      flex-direction: column;
    }

    .sliderContainer {
      display: none;
      @media only screen and (min-width: $ipad) {
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
    justify-content: center;
    min-height: 50%;
    min-width: 100%;
    padding: 5%;
    box-sizing: border-box;
    position: relative;
    @media only screen and (min-width: $ipad) {
      padding: unset;
      width: 50%;
      height: unset;
      min-height: unset;
      min-width: unset;
    }
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





