

<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 57 56.9"
    style="enable-background:new 0 0 57 56.9;"
    xml:space="preserve"
    :fill="fillColor"
    :class="{ svg: !selected }"
  >
    <g class="st0">
      <image
        style="display:inline;overflow:visible;enable-background:new    ;"
        width="1500"
        height="1500"
        xlink:href="../../../../../hagrid/wavetable.png"
        transform="matrix(9.448819e-02 0 0 9.448819e-02 -93.0779 111.6376)"
      ></image>
    </g>
    <g id="knapp2">
      <path
        class="st1"
        d="M5,0.5h46.7c2.8,0.6,4.4,2.2,4.8,4.7v46.4c-0.7,2.8-2.3,4.4-5,4.8H6c-2.3-0.2-4.8-2.1-5.5-5.1V5.6
		C1.1,3,2.5,1.2,5,0.5z"
      />
      <path class="st1" d="M92.7,224.8" />
      <rect x="20.8" y="20.5" class="st2" width="15.6" height="15.6" />
      <circle class="st2" cx="28.6" cy="28.3" r="5.3" />
      <rect x="36.4" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="5" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="20.7" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="20.8" y="4.9" class="st2" width="15.6" height="15.6" />
      <rect x="20.8" y="36.3" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="28.6,8.5 23.9,16.5 33.2,16.5 	" />
      <rect x="20.7" y="36.3" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="28.6,48.3 33.2,40.2 23.9,40.2 	" />
      <rect x="36.4" y="20.5" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="48.4,28.3 40.3,23.7 40.3,33 	" />
      <rect x="5" y="20.6" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="8.6,28.3 16.7,33 16.7,23.7 	" />
    </g>
    <g id="knapp"></g>
  </svg>
</template>


<script>
export default {
  name: "joyStick",
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
.st0 {
  display: none;
}
.st1 {
  stroke: #050505;
  stroke-miterlimit: 10;
}
.st2 {
  fill: none;
  stroke: #050505;
  stroke-miterlimit: 10;
}

.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
</style>