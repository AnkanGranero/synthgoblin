<template>
  <div class="menu" :class="{ 'menu-black': menuStep.length || componentData }">
    <ul v-if="!componentData" class="menu__options">
      <li
        v-for="(value, index) in currentMenuValues.values"
        :key="index"
        @click="handleClick(value, index)"
        class="menu__option"
      >
        {{ value.name }}
        <span
          v-if="value.type ==='toggle'"
          class="menu__toggle"
          :class="{'active': midiOutActive}"
        >{{toggleValue(value.name)}}</span>
      </li>
    </ul>
    <component
      v-else
      :is="componentData.component"
      @changedValue="changedValue"
      v-bind="componentData"
    />
    <div class="menu__option" @click="back()">back</div>
  </div>
</template>

<script>
import { menuValues } from "../../menuValues";
import SliderContainer from "../Slider/SliderContainer";
import MidiOutputs from "../menu/MidiOutputs";
import MidiChannels from "../menu/MidiChannels";
import MidiOptionSliders from "../Slider/MidiOptionSliders";

export default {
  name: "Menu",

  data() {
    return {
      menuStep: [],
      componentData: null
    };
  },
  components: {
    SliderContainer,
    MidiOutputs,
    MidiChannels,
    MidiOptionSliders
  },
  methods: {
    handleClick(value, index) {
      if (value.type === "text") {
        this.menuStep.push(index);
        return;
      }
      if (value.type === "component") {
        this.componentData = value;
        return;
      }
      if (value.type === "toggle") {
        this.$store.dispatch(value.action);
        return;
      }
      this.menuChoice(value);
    },

    back() {
      const { menuStep } = this;
      if (this.componentData) {
        this.componentData = null;
        return;
      }
      if (menuStep.length) {
        menuStep.splice(-1, 1);
        return;
      }
      this.$emit("menuEmit", "closeModal");
    },
    menuChoice(value) {
      this.$store.dispatch(value.action, value.payload);
      this.$emit("menuEmit", "closeModal");
    },
    changedValue({ val, name }) {
      this.$store.dispatch("setPlayingDiv", false);

      if (name === "x" || name === "y") {
        // change grid size sen create All arpeggios
        let newGridSize = this.gridSize;

        (newGridSize[name] = val),
          this.$store.dispatch("setGridSize", newGridSize);
        this.$store.dispatch("createAllArpeggios");
      }
    },
    toggleValue(name) {
      switch (name) {
        case "Midi out:":
          return this.midiOutActive ? "ON" : "OFF";
      }
    }
  },

  computed: {
    //hur gör jag nu för flera steg i detta menyträd?
    midiOutActive() {
      return this.$store.getters.midiOutActive;
    },
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
    }
    /*     menuOptionComponent() {
      return this.currentMenuValues.type === "component"
        ? this.currentMenuValues
        : false;
    } */
  }
};
</script>

<style lang="scss">
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
  font-size: 30px;

  @media only screen and (min-width: 375px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__input-wrapper {
    display: flex;
    justify-content: center;
  }
  &__input {
    width: 15%;
    margin-left: 5%;
  }
  &__options {
    margin-top: 70px;
    list-style: none;
    padding: 0;
  }
  &__option {
    font-size: 30px;
    margin-bottom: 2rem;
    cursor: pointer;
    text-align: center;
    @media only screen and (min-width: 1200px) {
      font-size: 40px;
    }
  }
  &__triangle {
    margin-right: 2rem;
  }
  &__toggle {
    color: red;
  }
}
.active {
  color: $hagrid-green;
}
</style>
