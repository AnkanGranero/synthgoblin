

<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 57.1 56.9"
    style="enable-background:new 0 0 57.1 56.9;"
    xml:space="preserve"
    class="svg"
    :fill="fillColor"
  >
    <g id="knapp"></g>
    <g id="Layer_15">
      <path class="st0" d="M-53.4,29.7" />
      <path
        class="st1"
        d="M5.1,0.5h46.7c2.8,0.6,4.4,2.2,4.8,4.7v46.4c-0.7,2.8-2.3,4.4-5,4.8H6c-2.3-0.2-4.8-2.1-5.5-5.1V5.5
		C1.2,3,2.6,1.2,5.1,0.5z"
      />
      <path class="st0" d="M35.7,41.8" />
      <path
        class="st0"
        d="M16.8,39.2c-4.6-3.5-7.5-9.1-7.5-15.3c0-10.6,8.6-19.3,19.3-19.3s19.3,8.6,19.3,19.3c0,7.5-4.3,14.1-10.7,17.2
		"
      />
      <path class="st0" d="M18.9,40.5c-0.7-0.4-1.4-0.9-2-1.4" />
      <path class="st0" d="M19.6,40.9c-0.3-0.1-0.5-0.2-0.8-0.4" />
      <path class="st0" d="M19.8,41.1" />
      <polyline class="st0" points="19.8,40.5 20,52.2 37.6,52.2 37.4,40.5 	" />
      <polygon class="st0" points="28.6,29.2 24.1,36.9 33,36.9 	" />
      <line class="st2" x1="11.1" y1="20.2" x2="21.1" y2="10.2" />
      <line class="st3" x1="14.6" y1="28.7" x2="24.6" y2="18.8" />
      <line class="st3" x1="24.6" y1="28.7" x2="14.6" y2="18.8" />
      <line class="st2" x1="28.4" y1="20.3" x2="38.3" y2="10.3" />
      <line class="st3" x1="31.9" y1="28.9" x2="41.8" y2="18.9" />
      <line class="st3" x1="41.8" y1="28.9" x2="31.9" y2="18.9" />
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




<style lang="scss">
.st0 {
  fill: none;
  stroke: #050505;
  stroke-miterlimit: 10;
}
.st1 {
  stroke: #050505;
  stroke-miterlimit: 10;
}
.st2 {
  fill: none;
}
.st3 {
  fill: none;
  stroke: #0e0f0e;
  stroke-miterlimit: 10;
}
.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
</style>