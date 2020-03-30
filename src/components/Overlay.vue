<template>
  <div class="overlay" @click="closeOverlay"></div>
</template>

<script>
export default {
  name: "Overlay",
  methods: {
    closeOverlay() {
      this.$emit("closeOverlay");
    }
  }
};
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: black;
  opacity: 0.5;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>