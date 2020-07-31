<template>
  <div
    class="wrapper"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
    @click="handleClick"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.12 32.01">
      <defs />
      <title>kugghjul</title>
      <g id="Layer_2" data-name="Layer 2">
        <path
          class="cls-1"
          :style="{ 'fill' : fillColor }"
          d="M17.24,6.36H24l.11,3.49a9.2,9.2,0,0,1,3,1.19c0,.07,2.62-2.41,2.62-2.41l4.82,4.77L32,16a13.18,13.18,0,0,1,1.29,3h3.44l.09,6.8H33.32a10,10,0,0,1-1.32,3l2.46,2.46-4.8,4.79-2.43-2.32a16.28,16.28,0,0,1-3.15,1.45v3.16H17.24V35.2a16.26,16.26,0,0,1-3.17-1.28L11.8,36.08,7,31.27,9.08,29a16.4,16.4,0,0,1-1.26-3.25H4.66l0-6.84,3.26,0a16.92,16.92,0,0,1,1.18-3.14L7,13.48l4.75-4.79L14.1,11a9.55,9.55,0,0,1,3.18-1.29"
          transform="translate(-4.66 -6.36)"
        />
      </g>
      <g id="Layer_3" data-name="Layer 3">
        <ellipse cx="16.06" cy="16" rx="11.87" ry="11.54" />
        <ellipse cx="16.06" cy="16" rx="11.87" ry="11.54" />
        <ellipse
          class="cls-1"
          :style="{ 'fill' : fillColor }"
          cx="16.06"
          cy="16"
          rx="10.72"
          ry="10.42"
        />
      </g>
      <g id="Layer_5" data-name="Layer 5">
        <text class="cls-3" transform="translate(11.5 19.88)">H</text>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: "IconInfo",
  data() {
    return {
      mouseOver: false
    };
  },
  computed: {
    fillColor() {
      return this.mouseOver ? "rgb(141, 223, 232)" : "#52bb59";
    }
  },
  methods: {
    handleClick() {
      this.$emit("clicked");
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
    /*     height: 150px;
    width: 150px; */
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
.cls-3 {
  font-size: 12px;
  font-family: OpenSans-ExtraBold, Open Sans;
  font-weight: 800;
  color: rgb(141, 223, 232);
}
</style>