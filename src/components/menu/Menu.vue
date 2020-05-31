<template>
  <div>
    <div class="menu">
      <InputOptions
        v-if="inputOption"
        :inputOption="inputOption"
        :initialValues="fields"
        v-bind="fields"
        @closeModal="eventEmitter('closeModal');"
      />
      <div
        v-for="(option, index) in pickedMenuOption"
        :key="index"
        class="menu__option"
        @click="choosenMenuOption(option)"
      >{{ option }}</div>
      <!--       <div v-if="chooseGridSize" class="menu__option" @click="choosenMenuOption('enter')">enter</div>
      -->
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
  /*   props: {
    menuOptions: {
      type: Array,
      default: () => []
    }
  }, */

  data() {
    return {
      fields: {
        gridsize: {
          x: "",
          y: ""
        },
        arpeggio: []
      },
      menuOptions: {
        main: ["theme", "arpeggio"],
        themes: ["classic", "80s"],
        arpeggio: arpeggios,
        gridsize: ["x", "y"]
      },
      menuTree: [],
      pickedMenuOption: ["themes", "arpeggio", "gridsize"],
      chooseGridSize: false,
      inputOption: ""
    };
  },
  mounted: function() {
    this.fields = this.$store.getters.getGridSize;
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
      if (option == "gridsize") {
        this.inputOption = "gridsize";
      }

      if (option == "minor7" || option == "major7") {
        this.$store.dispatch("changeArpeggio", arpeggioNotes[option]);
        this.eventEmitter("createAllArs");
        this.eventEmitter("closeModal");
      }
      this.menuTree.push(this.pickedMenuOption);
      this.pickedMenuOption = this.menuOptions[option];
    }
    /*    changeGridSize() { */
    /*       console.log("change grid size", payload);

      let { x, y } = this.fields;
      x = Number(x);
      y = Number(y); */
    /*  this.$store.dispatch("changeGridSize", { x, y }); */
    /*       this.eventEmitter("closeModal");
    } */
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
