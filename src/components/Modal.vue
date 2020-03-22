<template>
  <div class="modal">
    <div class="box box--y" @mousedown="setDirection('up')">
      <div class="box__wrapper">
        <div class="box__up"></div>
      </div>
    </div>

    <div class="box box--x">
      <div class="box__wrapper" @mousedown="setDirection('left')">
        <div class="box__left"></div>
      </div>
      <div class="box__wrapper">
        <div class="box__middle" @mousedown="removeArrowDiv"></div>
      </div>
      <div class="box__wrapper" @mousedown="setDirection('right')">
        <div class="box__right"></div>
      </div>
    </div>

    <div class="box box--y" @mousedown="setDirection('down')">
      <div class="box__wrapper">
        <div class="box__down"></div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "Modal",
  methods: {
    setDirection(dir) {
      this.$emit("directionSet", dir);
    },
    closeModal() {
      this.$emit("closeModal");
    },
    removeArrowDiv() {
      this.$emit("removeArrowDiv");
    }
  }
};
</script>

<style lang="scss">
.modal {
  height: 300%;
  width: 300%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  position: relative;
  top: -100%;
  left: -100%;
}
.box {
  display: flex;
  flex-grow: 1;
  width: 100%;

  &--x {
    display: flex;
    justify-content: space-evenly;
  }

  &--y {
    display: flex;
    justify-content: center;
    align-self: center;
    width: 30%;
  }

  &__wrapper {
    justify-content: center;
    flex-grow: 1;
    align-items: center;
    display: flex;
  }

  &__left {
    border-bottom: 10px solid transparent;
    border-right: 10px solid rgb(51, 51, 51);

    border-top: 10px solid transparent;
  }
  &__down {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-top: 10px solid rgb(51, 51, 51);
  }

  &__right {
    border-bottom: 10px solid transparent;
    border-left: 10px solid rgb(51, 51, 51);

    border-top: 10px solid transparent;
  }
  &__up {
    border-left: 10px solid transparent;
    border-bottom: 10px solid rgb(51, 51, 51);

    border-right: 10px solid transparent;
  }
  &__middle {
    border-radius: 50%;
    border: 3px dotted rgb(87, 86, 86);
  }
}
</style>