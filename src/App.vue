<template>
  <div id="app">
    <div class="header">
      <div></div>
      <Triangle :headerText="'theme'" />
      <div></div>
      <Triangle :headerText="'scales'" />

      <button class="header__button" @click="changeStyle('classic')">classic</button>
      <button class="header__button" @click="changeStyle('80s')">80s</button>
      <input type="text" class="header__text" v-model="intervals" />
      <button class="header__button" @mousemove="createScale">create pitches</button>
    </div>
    <GridLayout :styling="styling" :allScales="allScales" />
  </div>
</template>

<script>
import GridLayout from "./components/GridLayout";
import Triangle from "./components/Triangle";

export default {
  name: "App",
  components: {
    GridLayout,
    Triangle
  },
  data() {
    return {
      styling: "classic",
      scale: [1, 2, 2, 2, 1, 2, 2],
      intervals: "",
      allScales: []
    };
  },
  mounted() {
    this.createAllPitchArrs();
  },
  methods: {
    changeStyle(styling) {
      this.styling = styling;
    },
    createScale() {
      this.scale = this.intervals.split("");
      this.createAllPitchArrs();
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





