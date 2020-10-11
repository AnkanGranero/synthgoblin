


<template>
  <svg
    version="1.1"
    id="arrow"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 57.1 56.8"
    style="enable-background:new 0 0 57.1 56.8;"
    xml:space="preserve"
    :class="whatClass"
    @click="changePortalCreatorActive(false)"
  >
    <polygon class="st0" points="28.5,10.4 8.3,45.5 48.8,45.5 " />
  </svg>
</template>


<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "arrow",
  /*   props: {
    selected: {
      type: Boolean,
      default: true
    }
  }, */
  methods: {
    ...mapActions(["changePortalCreatorActive"])
  },
  computed: {
    ...mapState(["portalCreatorActive"]),
    whatClass() {
      return !this.portalCreatorActive ? "active" : "default";
    }
  }
};
</script>





<style lang="scss" scoped>
.st0 {
  stroke-miterlimit: 10;
}

/* .default {
  border: solid 1px white;
  &:hover {
    background: rgb(141, 223, 232);
  }
  background: $tv-button;
  stroke: $light-stroke;
}
.active {
  background: $tv-button-active;
  stroke: $dark-stroke;
} */
</style>