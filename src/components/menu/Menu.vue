<template>
  <div>
    <div class="menu">
      <div
        v-for="(option, index) in pickedMenuOption"
        :key="index"
        class="menu__option"
        @click="choosenMenuOption(option)"
      >
        <Triangle class="menu__triangle" />
        {{ option }}
      </div>
      <div class="menu__option" @click="choosenMenuOption('back')">
        <Triangle class="menu__triangle" />back
      </div>
    </div>
  </div>
</template>

<script>
import Triangle from "../Triangle";
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
      menuOptions: {
        main: ["theme", "scales"],
        theme: ["classic", "80s"],
        scales: ["Y-axis", "X-axis", "custom"]
      },
      menuTree: [],
      pickedMenuOption: ["theme", "scales"]
    };
  },
  components: {
    Triangle
  },
  methods: {
    eventEmitter(message) {
      console.log("varför körs jag?");

      this.$emit("menuEmit", message);
    },
    choosenMenuOption(option) {
      console.log("option", option);
      if (option == "back") {
        this.menuTree.length
          ? (this.pickedMenuOption = this.menuTree.pop())
          : this.eventEmitter("closeModal");

        return;
      }
      this.menuTree.push(this.pickedMenuOption);
      console.log("menuTree", this.menuTree);

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
  }
  &__triangle {
    margin-right: 2rem;
  }
}
</style>
