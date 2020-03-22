<template>
  <div id="app">
    <div class="header">
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

export default {
  name: "App",
  components: {
    GridLayout
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
        startKey += this.scale[i % 7];
      }
      this.allScales = allArrs;
    },
    createPitchArr(startKey) {
      let arr = [];
      let pianoKey = startKey;
      for (let i = 0; i <= 15; i++) {
        arr.push(this.hertzCalculator(pianoKey));
        pianoKey += this.scale[i % 7];
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
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");

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
.header {
  margin-bottom: 2%;
  height: 46px;
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





