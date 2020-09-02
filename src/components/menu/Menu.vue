<template>
  <div class="menu" :class="{ 'menu-black': menuStep.length }">
    <ul v-if="!menuOptionComponent">
      <li
        v-for="(value, index) in currentMenuValues.values"
        :key="index"
        @click="setMenuStep(index)"
        class="menu__option"
      >{{ value.name }}</li>
    </ul>
    <component
      v-else
      :is="menuOptionComponent.component"
      @changedValue="changedValue"
      v-bind="menuOptionComponent"
    />
    <div class="menu__option" @click="back()">back</div>
  </div>
</template>

<script>
import { menuValues } from "../../menuValues";
import SliderContainer from "../Slider/SliderContainer";
/* import InputOptions from "./InputOptions";
 */
/* const arpeggios = ["major7", "minor7", "custom"];
const arpeggioNotes = { major7: [4, 3, 4, 1], minor7: [3, 4, 3, 2] }; */

export default {
  name: "Menu",

  data() {
    return {
      menuStep: []
    };
  },
  components: {
    SliderContainer
  },
  methods: {
    setMenuStep(index) {
      this.menuStep.push(index);
    },
    back() {
      const { menuStep } = this;
      if (menuStep.length) {
        menuStep.splice(-1, 1);
      }
    },
    changedValue({ val, name }) {
      /*   this.values[type] = val; */
      console.log("type ", name);
      this.$store.dispatch("setPlayingDiv", false);
      /*       let newArpeggios = createAllArpeggios(
        this.arpeggio,
        this.gridSize,
        this.angle
      ); */
      if (name === "x" || name === "y") {
        // change grid size sen create All arpeggios
        let newGridSize = this.gridSize;
        console.log("gridSize", newGridSize);
        (newGridSize[name] = val),
          this.$store.dispatch("setGridSize", newGridSize);
        this.$store.dispatch("createAllArpeggios");
      }
    }
  },

  computed: {
    //hur gör jag nu för flera steg i detta menyträd?
    gridSize() {
      return this.$store.getters.getGridSize;
    },
    currentMenuValues() {
      const { menuStep } = this;
      switch (menuStep.length) {
        case 1:
          return menuValues.values[menuStep[0]];
        case 2:
          return menuValues[menuStep[0]].values[menuStep[1]];
      }
      return menuValues;
    },
    menuOptionComponent() {
      return this.currentMenuValues.type === "component"
        ? this.currentMenuValues
        : false;
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  &-black {
    background: black;
  }
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  align-content: center;

  @media only screen and (min-width: 375px) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  &__input-wrapper {
    display: flex;
    justify-content: center;
  }
  &__input {
    width: 15%;
    margin-left: 5%;
  }
  &__option {
    /*     display: flex;
 */
    font-size: 2rem;
    margin-bottom: 2rem;
    cursor: pointer;
    text-align: center;
    @media only screen and (min-width: 375px) {
    }
  }
  &__triangle {
    margin-right: 2rem;
  }
}
.grid-size {
  display: flex;
  flex-direction: column;
}
</style>
