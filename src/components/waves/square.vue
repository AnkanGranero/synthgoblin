

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :class="whatClass"
  >
    <defs />
    <title>square</title>

    <g id="Layer_12" data-name="Layer 12">
      <polyline
        class="cls-2"
        points="10.11 27.3 10.11 23.08 19.27 23.08 19.27 31.8 28.01 31.8 28.01 23.08 36.8 23.08 36.8 31.8 45.97 31.8 45.97 28.02"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: "square",
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    whatClass() {
      return this.selected ? "active" : "default";
    }
  }
};
</script>

