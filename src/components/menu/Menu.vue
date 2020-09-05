<template>
  <div>
    <div class="menu">
      <InputOptions
        v-if="inputOption"
        :inputOption="inputOption"
        :initialValues="fields[inputOption]"
        v-bind="fields"
        @back="inputOption=false"
        :inputType="inputType"
        @changeArpeggio="changeArpeggio"
      />
      <div
        v-for="(option, index) in pickedMenuOption"
        :key="index"
        class="menu__option"
        @click="choosenMenuOption(option)"
      >{{ option }}</div>
      <div class="menu__option" @click="choosenMenuOption('back')">back</div>
    </div>
  </div>
</template>

<script>
import InputOptions from "./InputOptions";

const arpeggios = ["major7", "minor7", "custom"];
const arpeggioNotes = { major7: [4, 3, 4, 1], minor7: [3, 4, 3, 2] };

export default {
  name: "Menu",

  data() {
    return {
      fields: {
        gridsize: {
          x: "",
          y: ""
        },
        custom: {
          arpeggio: ""
        }
      },
      menuOptions: {
        themes: ["classic", "80s"],
        arpeggio: arpeggios,
        angle: ["diatonic", "symetric"]
      },
      menuTree: [],
      pickedMenuOption: ["gridsize", "arpeggio", "angle"],
      chooseGridSize: false,
      inputOption: ""
    };
  },
  mounted: function() {
    this.fields.gridsize = this.$store.getters.getGridSize;
  },
  components: {
    InputOptions
  },
  methods: {
    eventEmitter(message) {
      this.$emit("menuEmit", message);
    },
    choosenMenuOption(option) {
      if (option == "back") {
        this.chooseGridSize = false;
        this.menuTree.length
          ? (this.pickedMenuOption = this.menuTree.pop())
          : this.eventEmitter("closeModal");

        return;
      }
      if (option === "gridsize" || option === "custom") {
        this.inputOption = option;
        return;
      }

      if (option === "diatonic" || option === "symetric") {
        this.eventEmitter("closeModal");
        this.$store.dispatch("changeAngle", option);
        this.eventEmitter("createAllArs");
      }

      if (option == "minor7" || option == "major7") {
        this.changeArpeggio(arpeggioNotes[option]);
      }
      this.menuTree.push(this.pickedMenuOption);
      this.pickedMenuOption = this.menuOptions[option];
    },
    changeArpeggio(newArpeggio) {
      this.$store.dispatch("changeArpeggio", newArpeggio);
      this.eventEmitter("createAllArs");
      this.eventEmitter("closeModal");
    }
  },
  computed: {
    inputType() {
      let inputType;
      switch (this.inputOption) {
        case "gridsize": {
          inputType = "slider";
          break;
        }
        case "custom": {
          inputType = "textInput";
          break;
        }
      }

      return inputType;
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  color: white;
  display: flex;
  flex-direction: column;
  align-content: center;

  @media only screen and (min-width: 375px) {
    display: unset;
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
