

<template>
  <svg
    id="Layer_10"
    data-name="Layer 10"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :fill="fillColor"
    :class="{ svg: !selected }"
  >
    <defs />
    <title>sawtooth</title>
    <path
      class="cls-1"
      d="M4.55,0H51.23C54,.64,55.66,2.21,56,4.74V51.13a5.77,5.77,0,0,1-5,4.82H5.45A6.25,6.25,0,0,1,0,50.89V5.07C.64,2.5,2,.7,4.55,0Z"
    />
    <polyline
      class="cls-2"
      points="46.05 27.98 33.24 33.81 33.24 21.88 10.11 33.81"
    />
  </svg>
</template>


<script>
export default {
  name: "sawtooth",
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fillColor() {
      return this.selected ? "#d9d283" : "#70b865";
    }
  }
};
</script>

<style lang="scss" scoped>
.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
.cls-2 {
  fill: none;
  stroke: #1d1d1b;
  stroke-miterlimit: 10;
}
</style>