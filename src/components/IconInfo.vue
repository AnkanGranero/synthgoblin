<template>
  <!-- <svg
    viewBox="0 0 95 95"
    :class="colorTheme"
    class="icon"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
    @click="$emit('clicked')"
  >
    <path
      class="iris"
      :class="[mouseOver ? 'fill' : '']"
      d="M0.5,47.6L0.5,47.6v10V47.6l0-0.2v-10l-0.5,0h0l10.3,0c1.6-5.9,3.9-9,3.9-9L7,21.3L21.1,7.2l7.1,6.8
	c4.5-2.8,9.3-4.3,9.3-4.3V0.5H37h0.5H58h0h-0.5v9.3c0,0,5.2,1.4,9.3,3.8l6.7-6.4l14.1,14.1l-6.1,6.6c0,0,2,3.6,3.7,9.5h9.3v-0.5
	l0,9.2v1.5l0-0.2v-10v10l0,0L95,57.6h-0.5l-9.8,0c-1.6,5.9-3.9,9-3.9,9l7.2,7.2L73.9,87.8L66.8,81c-4.5,2.8-9.3,4.3-9.3,4.3v9.3H58
	h-0.5H37.3H37h0.5v-9.3c0,0-5.2-1.4-9.3-3.8l-6.7,6.4L7.3,73.7l6.1-6.6c0,0-2-3.6-3.7-9.5H0.5v0.5"
    />

    <path
      class="st1"
      :class="[mouseOver ? 'fill' : '']"
      d="M43.6,80.8c-16-1.8-28.5-15.1-29.5-31.2c-1.3-20.3,15.5-37,35.8-35.6c16,1.1,29.3,13.7,31.1,29.6
	C83.2,65,65,83.2,43.6,80.8z"
    />
  </svg> --><svg
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
    class="icon"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
    @click="$emit('clicked')"
  >
    <path
      class="outer-wheel"
      :class="{ fill: mouseOver }"
      d="M0.5,47.6L0.5,47.6v10V47.6v-0.2v-10H0l0,0h10.3c1.6-5.9,3.9-9,3.9-9L7,21.3L21.1,7.2l7.1,6.8
	c4.5-2.8,9.3-4.3,9.3-4.3V0.5H37h0.5H58l0,0h-0.5v9.3c0,0,5.2,1.4,9.3,3.8l6.7-6.4l14.1,14.1l-6.1,6.6c0,0,2,3.6,3.7,9.5h9.3v-0.5
	v9.2v1.5v-0.2v-10v10l0,0L95,57.6h-0.5h-9.8c-1.6,5.9-3.9,9-3.9,9l7.2,7.2l-14.1,14L66.8,81c-4.5,2.8-9.3,4.3-9.3,4.3v9.3H58h-0.5
	H37.3H37h0.5v-9.3c0,0-5.2-1.4-9.3-3.8l-6.7,6.4L7.3,73.7l6.1-6.6c0,0-2-3.6-3.7-9.5H0.5v0.5"
    />

    <path
      class="circle"
      :class="{ fill: mouseOver }"
      d="M81,43.6C79.2,27.7,65.9,15.1,49.9,14c-20.3-1.4-37.1,15.3-35.8,35.6c1,16.1,13.5,29.4,29.5,31.2
	C65,83.2,83.2,65,81,43.6z M17.9,47.5 M77.3,47.5"
    />
    <g v-if="colorTheme === 'darkStar'">
      <g v-if="!mouseOver">
        <path
          class="open-eye"
          d="M17.9,47.5c16.4,16.4,43,16.4,59.4,0C60.9,31.1,34.3,31.1,17.9,47.5z"
        />
        <path
          class="iris"
          d="M34.4,46c0,7.5,6.1,13.7,13.7,13.7S61.7,53.5,61.7,46c0-3.7-1.5-7-3.8-9.5c-6.4-1.6-13-1.7-19.4-0.3
	C35.9,38.7,34.4,42.2,34.4,46z"
        />
      </g>
      <path
        v-if="mouseOver"
        class="closed"
        d="M17.9,47.6c16.4,16.4,43,16.4,59.4,0"
      />
    </g>
    <text
      v-if="colorTheme === 'classic'"
      transform="matrix(1 0 0 1 24.7153 69.1103)"
      class="letter"
    >
      H
    </text>
    <!--     <circle class="pupil" cx="47.8" cy="46.1" r="6.8" />
 -->
  </svg>
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
    colorTheme() {
      return this.$store.getters.getColorTheme;
    }
  }
};
</script>

<style lang="scss" scoped>
$medium: 768px;
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@800&display=swap");

.icon {
  height: 100px;
  width: 100px;
  border: none;
  fill: none;
  stroke-miterlimit: 10;
  cursor: pointer;

  @media only screen and (min-width: $medium) {
    height: 50%;
    width: 50%;
    border: none;
  }
}

.darkStar {
  .icon {
    stroke: white;
  }
  .circle {
    stroke: white;
    fill: $hagrid-green;
  }
  .closed {
    stroke: black;
  }
  .open-eye {
    fill: black;
    stroke: white;
  }

  .fill {
    stroke: black;
    stroke: white;
    fill: $blue;
  }

  .iris {
    fill: none;
    stroke: white;
    stroke-miterlimit: 10;
  }
  .outer-wheel {
    fill: black;
    stroke: white;
  }
}

.classic {
  .letter {
    font-family: "Open Sans", sans-serif;
    font-size: 61px;
    fill: black;
  }

  .icon {
    stroke: black;
  }
  .circle {
    stroke: black;
    fill: $hagrid-green;
  }

  .fill {
    stroke: black;
    stroke: white;
    fill: $blue;
  }

  .outer-wheel {
    fill: $hagrid-green;
    stroke: black;
  }
  .fill {
    stroke: black;
    stroke: white;
    fill: $blue;
  }
}
</style>