<template>
  <div id="app">
    <div class="header">
      <div></div>
      <div @click="openModal('theme')">
        <Triangle :headerText="'theme'" />
      </div>
      <Modal v-if="themeModalOpen">
        <button class="header__button" @click="changeTheme('classic')">classic</button>
        <button class="header__button" @click="changeTheme('80s')">80s</button>
      </Modal>
      <div></div>
      <div @click="openModal('scale')">
        <Triangle :headerText="'scales'" />
      </div>
      <Modal v-if="scaleModalOpen">
        <input type="text" class="header__text" v-model="intervals" />
        <button class="header__button" @click="createScale">create pitches</button>
      </Modal>
    </div>

    <GridLayout :styling="styling" :allScales="allScales" />
  </div>
</template>

<script>
import GridLayout from "./components/GridLayout";
import Triangle from "./components/Triangle";
import Modal from "./components/Modal";

export default {
  name: "App",
  components: {
    GridLayout,
    Triangle,
    Modal
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
      if (this.interval) {
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
  font-family: nintendo;

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
.header {
  margin-bottom: 2%;
  height: 46px;

  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
  &__wrapper {
    display: flex;
    justify-content: center;
  }

  &__button {
    background: white;
    height: 50%;
    width: auto;
    margin-right: 10px;
  }
  &__text {
    margin-right: 10px;
  }
}
</style>





