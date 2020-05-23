<template>
  <div
    class="wrapper"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
    @click="$emit('clicked')"
  >
    <svg
      v-if="!isPlaying"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.48 26.48"
    >
      <defs />
      <title>play</title>
      <path
        class="cls-1"
        :style="{ 'fill': fillColor }"
        d="M25.71,15.83A13.24,13.24,0,1,0,39,29.06,13.23,13.23,0,0,0,25.71,15.83ZM21.19,35.2s0-11.75,0-12.27l11.49,5.7Z"
        transform="translate(-12.48 -15.83)"
      />
    </svg>
    <svg
      v-else
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.48 26.48"
    >
      <defs />
      <title>stop</title>
      <path
        class="cls-1"
        :style="{ 'fill': fillColor }"
        d="M13.24,0A13.24,13.24,0,1,0,26.48,13.24,13.24,13.24,0,0,0,13.24,0Zm4.13,17.37H9.1V9.1h8.27Z"
      />
    </svg>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "IconInfo",
  data() {
    return {
      mouseOver: false
    };
  },
  computed: {
    ...mapState(["isPlaying"]),
    fillColor() {
      return this.mouseOver ? "rgb(141, 223, 232)" : "#52bb59";
    }
  }
};
</script>

<style lang="scss">
$medium: 768px;

.wrapper {
  height: 100px;
  width: 100px;

  @media only screen and (min-width: $medium) {
    height: unset;
    width: unset;
  }
}
.icon {
  @media only screen and (min-width: $medium) {
    height: 100%;
    width: 100%;
  }
}
</style>