<template>
  <div id="app">
    <h1 class="header" @click="openModal">Hagrid</h1>
    <!--     <div class="header">
      <button class="header__btn" @click="play">PLAY</button>
    </div>-->
    <Modal v-if="modalOpen" @modalEmit="modalEventHandler" />
    <div class="tv">
      <div class="tv__left">
        <img src="./assets/kugghjul.svg" class="tv__button" alt />
      </div>
      <div class="tv__middle">
        <GridLayout :styling="styling" :allScales="allScales" />
      </div>
      <div class="tv__right">
        <img src="./assets/play.svg" class="tv__button" alt="play button" @click="play" />
      </div>
      <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
    </div>
  </div>
</template>

<script>
import GridLayout from "./components/GridLayout";
/* import Triangle from "./components/Triangle"; */
import Modal from "./components/Modal";
import Overlay from "./components/Overlay";
/* import colorStyling from "./helpers/colorFunctions.js";
 */
export default {
  name: "App",
  components: {
    GridLayout,
    /*     Triangle, */
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
      modalOpen: false
    };
  },
  mounted() {
    this.createAllPitchArrs();
  },
  methods: {
    openModal() {
      this.modalOpen = true;
    },
    play() {
      console.log("playing");
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
    }
  },
  computed: {
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
<style lang="scss">
@font-face {
  font-family: "nintendo";
  src: url("./assets/fonts/press_start.ttf");
}
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");
//så småningom byta font till smoothare utstickande bitar
$square: 6.666666666666667%;
$background: #54bb5a;
/* .overlay {
  height: 100vh;
  z-index: -3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  position: relative;
} */

#app {
  z-index: -3;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  padding: 0 5%;
  display: flex;
  flex-direction: column;
}

.tv {
  background: black;
  width: 80%;

  align-content: center;
  display: flex;

  justify-content: space-between;

  padding: 10% 0;
  @media only screen and (min-width: 768px) {
    height: 40vw;
  }

  &__button {
    align-self: flex-start;
    width: 150px;
  }

  &__left {
    flex-grow: 1;
    display: flex;
    justify-content: center;
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
  }
  &__right {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
}

body {
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: $background;
  margin: 0;
  color: white;
}
* {
  font-family: "Open Sans", sans-serif;

  /*   font-family: "Roboto", sans-serif; */
}

.header {
  color: #d9d283;
  /* font-size: 200px; */
  font-size: 11rem;
  letter-spacing: -0.4rem;
  margin: 0 0 15% 0;

  /* display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
 */
  &__btn {
    background: white;
  }
  &__wrapper {
    display: flex;
    justify-content: center;
  }

  &__button {
    background: transparent;
    height: auto;
    width: auto;
    font-size: 3rem;
    margin-top: 10%;
    color: white;
    border: none;
  }
  &__text {
    height: 10%;
    background: #f1f1f1;
  }

  &__options {
    grid-column-start: 7;
    grid-column-end: 10;
  }
  &__triangle {
    height: 100%;
    width: 100%;
  }
}
</style>





