<template>
  <div
    class="wrapper"
    @click="$emit('clicked')"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
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
      <circle
        :class="mouseOver ? 'mouseOver' : 'button'"
        cx="47.5"
        cy="47.5"
        r="47.3"
      />
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
  methods: {},
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
  height: 70px;
  width: 70px;

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
.darkStar,
.yellowOrchestra {
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
  cursor: pointer;
}
.mouseOver {
  fill: $blue;
}
</style>