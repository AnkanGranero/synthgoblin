
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
    :class="{ svg: !portalCreatorActive }"
    @click="togglePortalCreator"
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
    <circle class="st2" cx="28.5" cy="28.5" r="22.4" />
    <circle class="st2" cx="28.5" cy="28.5" r="15.4" />
    <circle class="st2" cx="28.5" cy="28.5" r="7.9" />
  </svg>
</template>


<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "portal",
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(["togglePortalCreator"])
  },
  computed: {
    ...mapState(["portalCreatorActive"]),
    fillColor() {
      return this.portalCreatorActive ? "#d9d283" : "#D0DBCE";
    }
  }
};
</script>





<style lang="scss"  scoped>
.st0 {
  display: none;
}
.st1 {
  /*   fill: #70b865; */
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