<template>
  <div>
    <div class="menu">
      <div v-if="chooseGridSize" class="grid-size">
        <span>X</span>
        <input v-model="fields.x" value="x" />
        <span>Y</span>
        <input v-model="fields.y" value="y" />
      </div>
      <div
        v-for="(option, index) in pickedMenuOption"
        :key="index"
        class="menu__option"
        @click="choosenMenuOption(option)"
      >
        <!--   <Triangle class="menu__triangle" /> -->
        {{ option }}
      </div>
      <div v-if="chooseGridSize" class="menu__option" @click="choosenMenuOption('enter')">
        <!-- <Triangle class="menu__triangle" /> -->
        enter
      </div>
      <div class="menu__option" @click="choosenMenuOption('back')">
        <!-- <Triangle class="menu__triangle" /> -->
        back
      </div>
    </div>
  </div>
</template>

<script>
/* import Triangle from "../Triangle"; */
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
        x: "",
        y: ""
      },
      menuOptions: {
        main: ["theme", "scales"],
        themes: ["classic", "80s"],
        scales: ["Y-axis", "X-axis", "custom"],
        grid_size: []
      },
      menuTree: [],
      pickedMenuOption: ["themes", "scales", "grid_size"],
      chooseGridSize: false
    };
  },
  mounted: function() {
    this.fields = this.$store.getters.getGridSize;
  },
  components: {
    /*    Triangle */
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
      if (option == "grid_size") {
        this.chooseGridSize = true;
      }
      if (option == "enter") {
        let { x, y } = this.fields;
        x = Number(x);
        y = Number(y);
        this.$store.dispatch("changeGridSize", { x, y });
        this.eventEmitter("closeModal");
      }
      this.menuTree.push(this.pickedMenuOption);
      this.pickedMenuOption = this.menuOptions[option];
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  color: white;

  &__option {
    display: flex;
    font-size: 2rem;
    margin-bottom: 2rem;
    cursor: pointer;
  }
  &__triangle {
    margin-right: 2rem;
  }
}
.grid-size {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}
</style>
