<template>
  <div class="secretModal">
    <input v-model="x" type="text" @keydown="handleInput" />
    <input v-model="y" type="text" @keydown="handleInput" />

    <span @click="changeGridSize">Okidokonkely</span>
  </div>
</template>
<script>
export default {
  name: "secretModal",
  data() {
    return {
      x: "",
      y: ""
    };
  },
  methods: {
    handleInput(event) {
      let { charCode } = event;

      if ((charCode < 48 || charCode > 57) && charCode !== 0) {
        event.preventDefault();
      }
    },
    changeGridSize() {
      let { x, y } = this;
      this.$emit("changeGridSize", { x: Number(x), y: Number(y) });
    }
  }
};
</script>

<style lang="scss">
.secretModal {
  opacity: 0;
  position: absolute;
  top: 0;
  z-index: 2;
}
</style>