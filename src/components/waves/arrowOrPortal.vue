
<template>
  <div @click="toggleArrowAndPortal">
    <svg
      v-if="portalCreatorActive"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 57 56.9"
      style="enable-background:new 0 0 57 56.9;"
      xml:space="preserve"
      class="active"
    >
      <circle class="circles" cx="28.5" cy="28.5" r="22.4" />
      <circle class="circles" cx="28.5" cy="28.5" r="15.4" />
      <circle class="circles" cx="28.5" cy="28.5" r="7.9" />
    </svg>
    <svg
      v-else
      version="1.1"
      id="arrow"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 57.1 56.8"
      style="enable-background:new 0 0 57.1 56.8;"
      xml:space="preserve"
      class="active"
    >
      <polygon class="st0" points="28.5,10.4 8.3,45.5 48.8,45.5 " />
    </svg>
  </div>
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
    ...mapActions(["toggleArrowAndPortal"])
  },
  computed: {
    ...mapState(["portalCreatorActive"])
  }
};
</script>





<style lang="scss" >
.circles {
  fill: none;

  stroke-miterlimit: 10;
}
</style>