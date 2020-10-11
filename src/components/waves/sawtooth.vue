

<template>
  <svg
    id="Layer_10"
    data-name="Layer 10"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 56.02 55.95"
    :class="whatClass"
  >
    <defs />
    <title>sawtooth</title>

    <polyline
      class="cls-2"
      points="46.05 27.98 33.24 33.81 33.24 21.88 10.11 33.81"
    />
  </svg>
</template>


<script>
export default {
  name: "sawtooth",
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

<style lang="scss" scoped>
.cls-2 {
  fill: none;
}
</style>