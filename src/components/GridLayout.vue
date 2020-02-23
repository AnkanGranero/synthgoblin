<template>
  <div class="pageWrapper">
    <div v-for="y in 15" :key="y" :class="createGridClass(y)">
      <div
        v-for="x in 15"
        :key="x"
        :style="colorStyling(x,y)"
        @mousedown="mouseEventHandler(x, y)"
        @mouseup="mouseEventHandler(x, y)"
        @mouseover="mouseEventHandler(x, y)"
        @contextmenu.prevent="highlightToggle(x, y)"
        class="button-wrapper"
      >
        <button class="up"></button>
        <div class="center">
          <button class="left"></button>
          <button class="center">
            <img
              src="../assets/arrow.png"
              v-if="findInArr(x,y) || findInArr(x,y)=== 0"
              alt="arrow"
              :style="whatDirection(x,y)"
              @click="shootNotes(x,y)"
            />
          </button>
          <button class="right"></button>
        </div>
        <button class="down"></button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "GridLayout",
  data() {
    return {
      mousePos: { x: 0, y: 0 },
      highLightedDivs: []
    };
  },
  props: {},
  methods: {
    colorStyling(x, y) {
      let isHighLighted = this.isHighligthed(x, y);
      if (!isHighLighted) {
        return {
          background:
            "rgb(" + this.colorCalcY(y) + "," + this.colorCalcX(x) + ",250)"
        };
      } else {
        return { background: "black" };
      }
    },
    findInArr(x, y) {
      let findInArr = this.highLightedDivs.find(
        item => item.x === x && item.y === y
      );

      return findInArr ? this.highLightedDivs.indexOf(findInArr) : null;
    },
    whatDirection(x, y) {
      let index = this.findInArr(x, y);
      let arr = this.highLightedDivs[index];

      return [{ transform: `rotate(${arr.position})` }];
    },
    highlightToggle(x, y) {
      let target = event.toElement.classList.value;
      const { highLightedDivs } = this;
      let index = this.findInArr(x, y);
      if (!index && index != 0) {
        highLightedDivs.push({ x, y, direction: "center" });
        return;
      }

      switch (target) {
        case "center":
          highLightedDivs.splice(index, 1);
          break;
        case "left":
          highLightedDivs[index].position = "180deg";
          break;
        case "right":
          highLightedDivs[index].position = "0deg";
          break;
        case "up":
          highLightedDivs[index].position = "-90deg";
          break;
        case "down":
          highLightedDivs[index].position = "90deg";
          break;
      }
    },
    shootNotes(x, y) {
      let index = this.findIndex(x, y);
      let start = this.highLightedDivs[index];
    },
    isHighligthed(x, y) {
      let answer = this.highLightedDivs.find(
        item => item.x === x && item.y === y
      );
      return answer ? true : false;
    },
    mouseEventHandler(x, y) {
      this.$emit("mouseEvent", { x, y, event: event.type });
      this.mousePos = { x, y };
    },
    createGridClass(n) {
      return `row row-${n}`;
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
  }
};
</script>
<style lang="scss" scoped>
$square: 6.666666666666667%;

.pageWrapper {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-rows: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.row {
  display: grid;
  grid-template-columns: $square $square $square $square $square $square $square $square $square $square $square $square $square $square $square;
}

.button-wrapper {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;

  button {
    outline: none;
    background: none;
    height: 100%;
    width: 100%;
    border: none;
    img {
      height: 20px;
    }
  }
  .up,
  .down {
    width: 80%;
    align-self: center;
  }

  .center {
    display: flex;
    justify-content: space-between;
    height: 100%;

    img:hover {
      height: 2rem;
    }
  }
}
.highlight {
}
</style>