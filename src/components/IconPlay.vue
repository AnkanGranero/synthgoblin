<template>
  <div class="wrapper" @click="$emit('clicked')">
    <!--  <svg
      v-if="!isPlaying"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.48 26.48"
      :class="colorTheme"
    >
      <defs />
      <title>play</title>
      <path
        class="cls-1"
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
      :class="colorTheme"
    >
      <defs />
      <title>stop</title>
      <path
        class="cls-1"
        d="M13.24,0A13.24,13.24,0,1,0,26.48,13.24,13.24,13.24,0,0,0,13.24,0Zm4.13,17.37H9.1V9.1h8.27Z"
      />
    </svg> -->
    <svg
      version="1.1"
      id="Layer_5"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 95 95"
      style="enable-background:new 0 0 95 95;"
      xml:space="preserve"
      :class="colorTheme"
    >
      <circle class="button" cx="47.5" cy="47.5" r="47.3" />
      <path
        v-if="!isPlaying"
        class="symbol"
        d="M72.1,47.8L35.3,27.6c0.1,1.9,0,43.4,0,43.4L72.1,47.8z"
      />

      <rect
        v-else
        x="31.4"
        y="33.3"
        class="symbol"
        width="32.2"
        height="32.2"
      />
    </svg>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "IconPlay",
  data() {
    return {
      mouseOver: false
    };
  },
  methods: {
    /* mouseTouchHandler(event) {
      if (this.isMobile) {
        switch (event.type) {
          case "touchstart":
            this.mouseOver = true;
            break;
          case "touchend":
            this.mouseOver = false;
            break;
        }
      } else {
        switch (event.type) {
          case "mouseover":
            this.mouseOver = true;
            break;
          case "mouseleave":
            this.mouseOver = false;
            break;
        }
      }
    } */
  },
  computed: {
    ...mapState(["isPlaying", "isMobile"]),

    colorTheme() {
      return this.$store.getters.getColorTheme;
    }
  }
};
</script>

<style lang="scss" >
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

.symbol {
  stroke-miterlimit: 10;
}

.classic {
  .button {
    fill: $hagrid-green;
  }
  .symbol {
    stroke: #000000;
    fill: black;
  }
}
.newStar {
  .button {
    fill: black;
    stroke: white;
  }
  .symbol {
    fill: $hagrid-green;
    stroke: white;
  }
}
.button {
  stroke: #000000;
  stroke-miterlimit: 10;
  fill: $hagrid-green;
  &:hover {
    fill: $blue;
    cursor: pointer;
  }
}
</style>