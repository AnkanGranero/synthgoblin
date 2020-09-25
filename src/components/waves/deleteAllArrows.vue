

<template>
  <svg
    :fill="fillColor"
    class="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 57.02 56.95"
  >
    <defs></defs>
    <title>deleteAllArrows</title>
    <g id="knapp2">
      <path
        class="cls-1"
        d="M5.1,50.84H51.78c2.82.64,4.43,2.21,4.79,4.74V102a5.76,5.76,0,0,1-5,4.82H6a6.26,6.26,0,0,1-5.45-5.06V55.91C1.19,53.34,2.59,51.54,5.1,50.84Z"
        transform="translate(-0.05 -50.34)"
      />
      <polygon
        class="cls-2"
        points="16.29 19.84 21.87 41.64 23.18 41.64 17.43 19.84 16.29 19.84"
      />
      <path
        class="cls-3"
        d="M21.32,70.18"
        transform="translate(-0.05 -50.34)"
      />
      <polygon
        class="cls-2"
        points="40.68 20.01 35.26 41.85 33.95 41.86 39.54 20.02 40.68 20.01"
      />
      <path class="cls-1" d="M28.56,92" transform="translate(-0.05 -50.34)" />
      <polyline class="cls-4" points="28.51 42.09 28.51 20.03 28.51 19.48" />
    </g>
    <g id="eraseAll">
      <path
        class="cls-5"
        d="M19.11,94.83H38.6l6.11-27.11H12.41l6.7,27.11Z"
        transform="translate(-0.05 -50.34)"
      />
      <polygon
        class="cls-5"
        points="11.49 14.3 45.2 14.3 45.2 11.45 28.51 11.45 11.49 11.45 11.49 14.3"
      />
      <rect class="cls-5" x="25.03" y="8.11" width="6.96" height="2.66" />
    </g>
  </svg>
</template>


<script>
export default {
  name: "deleteAllArrows",
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fillColor() {
      return "#D0DBCE";
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

.cls-1,
.cls-4 {
  stroke: #050505;
}
.cls-1,
.cls-2,
.cls-3,
.cls-4,
.cls-5 {
  stroke-miterlimit: 10;
}
.cls-2 {
  fill: #050505;
}
.cls-2,
.cls-5 {
  stroke: #000;
}
.cls-3 {
  stroke: #fff;
}
.cls-4 {
  stroke-width: 2.1px;
}
.cls-5 {
  fill: none;
}
.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
</style>