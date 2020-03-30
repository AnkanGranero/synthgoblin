<template>
  <div id="app">
    <div class="header">
      <div class="header__theme" @click="openModal('theme')">
        <Triangle :headerText="'theme'" />
      </div>
      <Modal v-if="themeModalOpen">
        <button class="header__button" @click="changeTheme('classic')">classic</button>
        <button class="header__button" @click="changeTheme('80s')">80s</button>
      </Modal>

      <div class="header__scale" @click="openModal('scale')">
        <Triangle :headerText="'scales'" />
      </div>
      <Modal v-if="scaleModalOpen">
        <input type="text" class="header__text" v-model="intervals" />
        <button class="header__button" @click="createScale">create pitches</button>
      </Modal>
    </div>

    <GridLayout :styling="styling" :allScales="allScales" />
    <Overlay v-if="overlayVisible" @closeOverlay="closeOverlay" />
  </div>
</template>

<script>
import GridLayout from "./components/GridLayout";
import Triangle from "./components/Triangle";
import Modal from "./components/Modal";
import Overlay from "./components/Overlay";

export default {
  name: "App",
  components: {
    GridLayout,
    Triangle,
    Modal,
    Overlay
  },
  data() {
    return {
      styling: "classic",
      scale: [1, 2, 2, 2, 1, 2, 2],
      intervals: "",
      allScales: [],
      themeModalOpen: false,
      scaleModalOpen: false
    };
  },
  mounted() {
    this.createAllPitchArrs();
  },
  methods: {
    openModal(type) {
      switch (type) {
        case "theme": {
          this.themeModalOpen = true;
          break;
        }
        case "scale": {
          this.scaleModalOpen = true;
          break;
        }
      }

      this.modalOpen = true;
    },
    changeTheme(styling) {
      this.styling = styling;
      this.themeModalOpen = false;
    },
    createScale() {
      if (this.intervals) {
        console.log("hej hopp ");

        this.scale = this.intervals.split("");
        this.createAllPitchArrs();
      }
      this.scaleModalOpen = false;
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
      return Math.pow(2, n / 12) * 220;
    },
    closeOverlay() {
      console.log("closingOverlay");
      this.scaleModalOpen = false;
      this.themeModalOpen = false;
    }
  },
  computed: {
    overlayVisible() {
      return this.themeModalOpen || this.scaleModalOpen;
    }
  }
};
</script>
<style lang="scss">
@font-face {
  font-family: "nintendo";
  src: url("./assets/fonts/press_start.ttf");
}

@import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");
$square: 6.666666666666667%;
.overlay {
  height: 100vh;
  z-index: -3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5%;
  position: relative;
}

#app {
  height: 100vh;
  z-index: -3;

  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  padding: 5%;
}

body {
  margin: 0;
  min-width: fit-content;
  min-height: fit-content;
  background: black;
  margin: 0;
}
* {
  font-family: nintendo;
}

.header {
  margin-bottom: 5%;
  height: 46px;

  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
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

  &__theme {
    grid-column-start: 2;
  }
  &__scale {
    grid-column-start: 5;
  }
}
</style>





