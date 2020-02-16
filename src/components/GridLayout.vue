<template>
  <div class="gridContainer">
    <div v-for="y in 14" :key="y" :class="createGridClass(y)">
      <span
        v-for="x in 14"
        :key="x"
        :style=" { background: 'rgb(' + colorCalcY(y) + ',' + colorCalcX(x) + ',255)' }"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GridLayout",
  data() {
    return {};
  },
  props: {
    mousePos: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    createGridClass(n) {
      return `item item-${n}`;
    },
    colorCalcY(n) {
      let subtract = n - (this.mousePos.y - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    },
    colorCalcX(n) {
      let subtract = n - (this.mousePos.x - 1);
      let blend = subtract < 0 ? subtract * -1 : subtract;
      return blend * 18;
    }
    /*     handleClick(n) {
      this.mousePos = n;
    } */
  }
};
</script>
<style lang="scss" scoped>
$square: 7.14285714%;

.gridContainer {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.item {
  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}
</style>