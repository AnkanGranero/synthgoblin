<template>
  <svg
    viewBox="0 0 95 95"
    class="icon"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    <path
      class="st0"
      :class="{ fill: mouseOver }"
      d="M0.5,47.6L0.5,47.6v10V47.6l0-0.2v-10l-0.5,0h0l10.3,0c1.6-5.9,3.9-9,3.9-9L7,21.3L21.1,7.2l7.1,6.8
	c4.5-2.8,9.3-4.3,9.3-4.3V0.5H37h0.5H58h0h-0.5v9.3c0,0,5.2,1.4,9.3,3.8l6.7-6.4l14.1,14.1l-6.1,6.6c0,0,2,3.6,3.7,9.5h9.3v-0.5
	l0,9.2v1.5l0-0.2v-10v10l0,0L95,57.6h-0.5l-9.8,0c-1.6,5.9-3.9,9-3.9,9l7.2,7.2L73.9,87.8L66.8,81c-4.5,2.8-9.3,4.3-9.3,4.3v9.3H58
	h-0.5H37.3H37h0.5v-9.3c0,0-5.2-1.4-9.3-3.8l-6.7,6.4L7.3,73.7l6.1-6.6c0,0-2-3.6-3.7-9.5H0.5v0.5"
    />
    <path
      class="st1"
      :class="{ fill: mouseOver }"
      d="M43.6,80.8c-16-1.8-28.5-15.1-29.5-31.2c-1.3-20.3,15.5-37,35.8-35.6c16,1.1,29.3,13.7,31.1,29.6
	C83.2,65,65,83.2,43.6,80.8z"
    />
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
  computed: {},
  methods: {
    handleClick() {
      this.$emit("clicked");
    }
  }
};
</script>

<style lang="scss" scoped>
$medium: 768px;
.icon {
  height: 100px;
  width: 100px;
  border: none;
  stroke: black;
  fill: none;
  stroke: $yellow;
  stroke-miterlimit: 10;
  @media only screen and (min-width: $medium) {
    /*     height: 150px;
    width: 150px; */
    height: 147px;
    width: 100px;
    border: none;
  }
}

/* .icon {
  @media only screen and (min-width: $medium) {
    height: 100%;
    width: 100%;
  }
} */
/* 
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
.cls-1 {

  fill: none;
  stroke: black;
  stroke-miterlimit: 10;
  &:hover {
    fill: red;
  }
}

.cls-3 {
  font-size: 12px;
  font-family: OpenSans-ExtraBold, Open Sans;
  font-weight: 800;
  color: rgb(141, 223, 232);
  fill: none;
  stroke: black;
  stroke-miterlimit: 10;
}
.kugg-hjul {
  background: green;
} */
.st0 {
  stroke: white;
  fill: green;
}
.st1 {
  fill: $yellow;
  fill: rgb(240, 116, 240);
}
.fill {
  stroke: black;
  background: red;
  fill: green;
}

/* .default {
  margin: none;
} */
</style>