
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
    :class="{ svg: isMuted }"
    @click="toggle()"
  >
    <g class="st0">
      <image
        style="display:inline;overflow:visible;enable-background:new    ;"
        width="1500"
        height="1500"
        transform="matrix(9.448819e-02 0 0 9.448819e-02 -19.1786 111.6376)"
      ></image>
    </g>
    <g id="knapp2">
      <path
        class="st1"
        d="M5,0.5h46.7c2.8,0.6,4.4,2.2,4.8,4.7v46.4c-0.7,2.8-2.3,4.4-5,4.8H6c-2.3-0.2-4.8-2.1-5.5-5.1V5.6
		C1.1,3,2.5,1.2,5,0.5z"
      />
    </g>
    <path class="st2" d="M16.7,33.2" />
    <polyline
      class="st2"
      points="16.9,23.2 23,18.8 34.2,10.7 34.2,46.2 16.7,33.6 16.7,33.5 "
    />
    <line class="st2" x1="16.9" y1="23.2" x2="16.9" y2="23.2" />
    <polyline class="st2" points="17.1,23.2 8.3,23.2 8.3,33.7 16.9,33.7 " />
    <path
      class="st2"
      d="M36.8,33.3c0.3-0.2,2.9-2.1,2.8-5.3c-0.1-3-2.5-4.8-2.8-5"
    />
    <path
      class="st2"
      d="M39.7,37.4c0.4-0.3,5.1-3.6,4.9-9.2c-0.1-5.3-4.4-8.3-4.9-8.6"
    />
    <path
      class="st2"
      d="M43.8,40.2c0.4-0.4,5.1-4.8,4.9-12.4c-0.1-7.1-4.4-11.1-4.9-11.6"
    />
  </svg>
</template>


<script>
import { changeMuteState } from "../../playStuff/playStuff";
export default {
  name: "mute",
  data() {
    return {
      isMuted: false
    };
  },
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggle() {
      this.isMuted = !this.isMuted;
      changeMuteState(this.isMuted);
    }
  },
  computed: {
    fillColor() {
      return this.isMuted ? "#D0DBCE" : "#d9d283";
    }
  }
};
</script>






<style lang="scss" scoped >
.st0 {
  display: none;
}
.st1 {
  stroke: #050505;
  stroke-miterlimit: 10;
}
.st2 {
  fill: none;
  stroke: #000000;
  stroke-miterlimit: 10;
}

.svg {
  &:hover {
    fill: rgb(141, 223, 232);
  }
}
</style>