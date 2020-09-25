<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :fill="fillColor"
    :class="{ svg: !selected }"
  >
    <defs />
    <title>sine</title>
    <g id="Layer_13" data-name="Layer 13">
      <path
        class="cls-1"
        d="M4.55,0H51.23C54,.64,55.66,2.21,56,4.74V51.13a5.77,5.77,0,0,1-5,4.82H5.45A6.25,6.25,0,0,1,0,50.89V5.07C.64,2.5,2,.7,4.55,0Z"
      />
    </g>
    <g id="Layer_3" data-name="Layer 3">
      <path
        class="cls-2"
        d="M9.72,26.64s7.32-15.15,13.8,0c9.27,21.71,23.41,3.28,22.4,0"
      />
    </g>
  </svg>
</template>


<script>
export default {
  name: "sine",
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
.cls-2 {
  fill: none;
  stroke: #1d1d1b;
  stroke-miterlimit: 10;
}
.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
</style>