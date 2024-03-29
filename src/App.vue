<template>
  <div class="hagrid" :class="'hagrid__' + getColorTheme">
    <Modal v-if="modalIsOpen" @modalEmit="modalEventHandler" />

    <SecretModal v-if="!isMobile" />
    <div class="tv-wrapper" :class="'tv-wrapper__' + getColorTheme">
      <CHeader v-if="getColorTheme === 'classic'" />
      <div class="tv" :class="'tv__' + getColorTheme" v-if="tvFinishedLoaded">
        <div class="tv__top-mobile">
          <IconPlay class="tv__large-button" @clicked="play" />
          <IconInfo class="tv__large-button" @clicked="openModal" />
        </div>
        <div class="tv__left">
          <IconInfo class="tv__large-button" @clicked="openModal" />

          <TvButtonsComponent v-if="!isMobile" />
        </div>
        <div class="tv__middle">
          <CHeader v-if="getColorTheme === 'darkStar'" />
          <GridLayout
            :styling="styling"
            ref="gridLayout"
            @clicked-on-square="playNote"
          />
          <TvButtonsComponent
            v-if="isMobile"
            :desktopVersion="false"
            class="tv__buttons-mobile"
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
              :initialValue="bpm"
              method="changeBpm"
              :adjustValueToSlide="false"
            />
            <Slider
              :largeText="false"
              name="Rev"
              :max-value="1"
              :min-value="0"
              value-type="Tone"
              :initial-value="reverb"
              method="changeReverb"
            />
            <Slider
              :largeText="false"
              name="Vol"
              :max-value="10"
              :min-value="0"
              value-type="Tone"
              :actual-value="true"
              :initialValue="initialVolume"
              method="changeVolume"
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
  SecretModal,
  CHeader,
} from "./components/index.js";
import IconInfo from "./components/IconInfo";
import IconPlay from "./components/IconPlay";
import * as Tone from "tone";

import {
  playThang,
  stopPlaying,
  preparePlayStuff,
  synth,
  tempoInBpm,
  reverb,
} from "./playStuff/playStuff";
import { mapGetters, mapActions, mapState } from "vuex";
import { midiPlay, midiStop } from "./midi-service/midiService";
import { getAllCachedInfo } from "./utils/cacheMethods";
import { getCoordinatesFromRefName } from "./utils/squareRefHelpers";

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
    SecretModal,
    CHeader,
  },
  created: function () {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.$store.commit("isMobile");
    }
  },
  data() {
    return {
      styling: "classic",
      intervals: "",

      selectedWaveform: "sawtooth",
      tvFinishedLoaded: false,
      manualDirection: "",
      direction: "",
      eraseKeyDown: false,
      lastPlayedDiv: "",
      nextPlayingDiv: "",
      justChangedDirection: false,
      synth,
      initialVolume: 8,
    };
  },

  mounted() {
    this.setupCachedInfo();

    this.createNewArpeggios();

    preparePlayStuff();
    window.addEventListener("keyup", (e) => {
      this.handleKeyUpCommands(e);
    });
    window.addEventListener("keydown", (e) => {
      this.handleKeyDownCommands(e);
    });
  },

  methods: {
    ...mapActions(["setPlayingDiv", "changeIsPlayingState"]),
    setupCachedInfo() {
      const cachedInfo = getAllCachedInfo();
      let { arrowRefs, gridSize, transformedSquares, waveform, volume } =
        cachedInfo;

      if (gridSize) {
        this.$store.dispatch("changeGridSize", gridSize);
      }
      if (transformedSquares) {
        this.$store.dispatch("bulkAddTransformedSquares", transformedSquares);
      }
      this.$store.dispatch("setAllCachedInfo", cachedInfo);
      if (waveform) {
        this.$store.dispatch("setSelectedWaveform", waveform);
      }
      if (volume || volume === 0) {
        this.initialVolume = volume;
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
        : this.synth.triggerAttackRelease(note, "8n");
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
      this.changeIsPlayingState(false);
      this.changeHighlightClass(this.lastPlayedDiv.refName, "remove");
      this.lastPlayedDiv = "";
      this.setPlayingDiv(null);
      this.midiStop();
    },
    async play() {
      if (this.isPlaying) {
        this.stop();
        return;
      }

      let firstArrowRef = await this.getStartingArrow;
      if (!firstArrowRef) {
        return;
      }
      this.setPlayingDiv(firstArrowRef);
      this.$store.commit("changeIsPlayingState", true);
      playThang(this.repeat);
    },
    repeat(time) {
      if (this.lastPlayedDiv) {
        this.changeHighlightClass(this.lastPlayedDiv.refName, "remove");
      }
      if (!this.isPlaying) this.stop();
      if (this.justChangedDirection && this.lastPlayedDiv) {
      }
      let isTransformedSquare = this.findTransformedSquare(
        this.playingDiv.refName
      );
      let { x, y, refName, direction, type, connectsTo } = this.playingDiv;
      let squareIsWithinGrid = this.gridRefs[refName];

      if (!squareIsWithinGrid) {
        this.stop();
        return;
      }
      this.changeHighlightClass(refName, "add");

      if (this.eraseKeyDown && type) {
        this.$store.dispatch("removeTransformedSquare", this.playingDiv);
        isTransformedSquare = false;
        direction = this.direction;
        type = "";
      }

      if (direction) {
        this.direction = direction;
      }
      let note = this.allArpeggios[x - 1][y - 1];

      if (type !== "Pause") {
        this.midiOutActive
          ? this.midiPlay(note)
          : this.synth.triggerAttackRelease(note, "8n", time);
      }

      let nextCoordinates;

      if (type === "Portal" && this.lastPlayedDiv.refName !== connectsTo) {
        nextCoordinates = this.nextCoordinatesBasedOnConnetion(this.playingDiv);
      } else {
        nextCoordinates = this.nextCoordinatesBasedOnDirection(this.playingDiv);
      }
      this.lastPlayedDiv = this.playingDiv;
      if (!nextCoordinates) {
        return;
      }
      let isNextSquareTransformed = this.findTransformedSquare(
        nextCoordinates.refName
      );
      let nextSquareInfo = isNextSquareTransformed
        ? isNextSquareTransformed
        : nextCoordinates;

      this.$store.dispatch("setPlayingDiv", nextSquareInfo);

      // ta reda på direction, antingen
    },
    changeHighlightClass(refName, action) {
      const target = this.gridRefs[refName];
      if (target && target[0]) {
        if (action === "add") {
          target[0].classList.add("highlight");
        }
        if (action === "remove") {
          target[0].classList.remove("highlight");
        }
      }
    },
    changedDirectionsManually() {
      const nextCoordinatesInfo = {
        x: this.lastPlayedDiv.x,
        y: this.lastPlayedDiv.y,
      };
      let suddenlyChangedCoordinates =
        this.nextCoordinatesBasedOnDirection(nextCoordinatesInfo);

      const refName = this.getRefFromCoordinates(
        suddenlyChangedCoordinates.x,
        suddenlyChangedCoordinates.y
      );

      this.setPlayingDiv({
        ...suddenlyChangedCoordinates,
        refName,
      });
      if (this.writeKeyDown) {
        this.lastPlayedDiv.direction = this.direction;
        this.$store.dispatch("addTransformedSquare", this.lastPlayedDiv);
      }
      this.justChangedDirection = false;
    },
    getRefFromCoordinates(x, y) {
      return `r${x}-${y}`;
    },

    nextCoordinatesBasedOnDirection(playingDiv) {
      let { x, y } = playingDiv;
      switch (this.direction) {
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
      let refName = this.getRefFromCoordinates(x, y);
      return { x, y, refName };
    },
    nextCoordinatesBasedOnConnetion(transformedSquare) {
      let { connectsTo } = transformedSquare;

      if (!connectsTo) {
        this.stop();
        return;
      }
      let { x, y, refName } = this.findTransformedSquare(connectsTo);
      return { x, y, refName };
    },
    handleKeyDownCommands(e) {
      if (this.joystickMode && e.keyCode > 36 && e.keyCode < 41) {
        let direction = e.key.replace("Arrow", "").toLowerCase();
        this.direction = direction;
        this.justChangedDirection = true;
        e.preventDefault();
      }
      if (e.keyCode === 32) {
        e.preventDefault();
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
    midiStop,
  },
  computed: {
    ...mapState([
      "playingDiv",
      "isPlaying",
      "allArpeggios",
      "angle",
      "modalIsOpen",
      "joystickMode",
      "isMobile",
    ]),
    ...mapGetters([
      "getPortalConnection",
      "getColorTheme",
      "getStartingArrow",
      "findTransformedSquare",
    ]),

    bpm() {
      return tempoInBpm;
    },
    reverb() {
      return reverb.wet.value;
    },
    gridSize() {
      return this.$store.getters.getGridSize;
    },
    gridRefs() {
      return this.$refs.gridLayout.$refs;
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
          background: "white",
        };
      }
    },
  },
  metaInfo() {
    return {
      title: "Hagrid grid sequencer",
      meta: [
        {
          vmid: "description",
          name: "Hagrid grid sequencer",
          content: "A grid sequencer you can use in your browswer, enjoy!",
        },
      ],
    };
  },
};
</script>
<style lang="scss" >
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");
//så småningom byta font till smoothare utstickande bitar
$square: 6.666666666666667%;

$leafGreen: #368a3c;

.hagrid {
  -webkit-user-select: none;
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
  &__darkStar {
    background: black;
    position: fixed;
    height: 100%;
  }
}
html {
  -webkit-user-select: none;
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
  -webkit-user-select: none;
  height: 100%;
  width: 100%;
  min-height: 100%;
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: $hagrid-green;

  margin: 0;

  font-size: 1.5rem;
  letter-spacing: -1px;
  font-family: "Open Sans", sans-serif;
}
.blackStar {
}

.tv-wrapper {
  height: 100%;
  width: 100%;
  position: fixed;
  @media only screen and (min-width: $ipad) {
    position: unset;
    height: 85%;
    width: unset;
    margin: 0 14%;
  }
  &__darkStar {
    @media only screen and (min-width: $ipad) {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }
}

.tv {
  background: black;
  width: 100%;
  border-radius: 30px;
  align-content: center;
  display: flex;
  min-height: 100%;

  justify-content: space-between;
  height: 100%;

  flex-direction: column;

  &__yellowOrchestra {
    background: $yellowStrong;
  }

  @media only screen and (min-width: $ipad) {
    position: unset;
    min-height: unset;

    padding: 12.5% 0;
    height: unset;
    width: 80%;
    width: 100%;
    flex-direction: row;
  }
  &__darkStar {
    @media only screen and (min-width: $ipad) {
      padding: 0;
      width: 85%;
    }
  }
  &__top-mobile {
    display: flex;
    justify-content: space-evenly;
    padding: 5% 0;
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
    flex-direction: column;
    justify-content: center;
    min-height: 50%;
    min-width: 100%;
    padding: 0 5%;
    box-sizing: border-box;
    display: flex;
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





