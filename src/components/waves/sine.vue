<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :class="whatClass"
  >
    <defs />
    <title>sine</title>

    <g id="Layer_3" data-name="Layer 3">
      <path
        class="cls-2"
        d="M9.72,26.64s7.32-15.15,13.8,0c9.27,21.71,23.41,3.28,22.4,0"
      />
    </g>
  </svg>
</template>


<script>
export default {
  name: "sine",
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

