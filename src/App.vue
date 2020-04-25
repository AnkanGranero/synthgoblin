<template>
  <div id="app">
    <div class="header">
      <h1 @click="openModal">HAGRID</h1>
      <button class="header__btn" @click="play">PLAY</button>
    </div>
    <Modal v-if="modalOpen" @modalEmit="modalEventHandler" />
    <GridLayout :styling="styling" :allScales="allScales" />
    <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
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
      console.log("play");
    },
    changeTheme(styling) {
      this.styling = styling;
      this.modalOpen = false;
    },
    createScale() {
      if (this.intervals) {
        console.log("hej hopp ");

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
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap");
$square: 6.666666666666667%;
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
  height: 100vh;
  z-index: -3;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  padding: 5%;
  display: flex;
  flex-direction: column;
}

body {
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: black;
  margin: 0;
  color: white;
}
* {
  font-family: nintendo;
  /*   font-family: "Roboto", sans-serif; */
}

.header {
  margin-bottom: 10%;
  height: 46px;

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





