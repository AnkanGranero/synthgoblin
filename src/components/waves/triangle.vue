

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :class="whatClass"
  >
    <defs />
    <title>triangle</title>

    <polyline
      class="cls-2"
      points="10.07 27.98 14.43 23.9 23.58 32.21 32.51 23.9 41.66 32.21 45.91 28.05"
    />
  </svg>
</template>
<script>
export default {
  name: "triangle",
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

