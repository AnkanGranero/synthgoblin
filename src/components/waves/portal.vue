
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
    :class="whatClass"
    @click="changePortalCreatorActive(true)"
  >
    <circle class="circles" cx="28.5" cy="28.5" r="22.4" />
    <circle class="circles" cx="28.5" cy="28.5" r="15.4" />
    <circle class="circles" cx="28.5" cy="28.5" r="7.9" />
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
    ...mapActions(["changePortalCreatorActive"])
  },
  computed: {
    ...mapState(["portalCreatorActive"]),
    whatClass() {
      return this.portalCreatorActive ? "active" : "default";
    }
  }
};
</script>





<style lang="scss" >
.circles {
  fill: none;

  stroke-miterlimit: 10;
}
</style>