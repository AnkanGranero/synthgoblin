<template>
  <div id="app">
    <div class="header">
      <button class="header__button" @click="changeStyle('classic')">classic</button>
      <button class="header__button" @click="changeStyle('80s')">80s</button>
    </div>
    <GridLayout :styling="styling" />
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
      styling: "classic"
    };
  },
  methods: {
    changeStyle(styling) {
      this.styling = styling;
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
}
</style>





