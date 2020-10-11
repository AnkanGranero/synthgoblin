<template>
  <div class="tv-button">
    <slot />
  </div>
</template>

<script>
export default {
  name: "TvButtonComponent",
  props: {
    value: {
      type: String,
      default: "sine"
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  components: {}
};
</script>
<style lang="scss">
$hagridGreen: #54bb5a;
$blue: rgb(141, 223, 232);
$yellow: #d9d283;

.tv-button {
  display: flex;
  justify-content: center;
  margin: 6%;
  stroke-miterlimit: 10;
  fill: none;

  &__btn {
    width: 100%;
    border-radius: 10%;
    box-sizing: border-box;

    @media only screen and (min-width: 2300px) {
      width: 36%;
    }
  }
}
.default {
  &:hover {
    background: rgb(141, 223, 232);
    /*     background: $hagridGreen; */
    border: none;
    stroke: black;
  }

  stroke: $dark-stroke;
  background: rgb(121, 208, 132);
  stroke: $light-stroke;
  background: black;
  border: solid 1px white;
}
.active {
  background: $tv-button-active;
  stroke: $dark-stroke;
}
</style>