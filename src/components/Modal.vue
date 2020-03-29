<template>
  <div class="modal">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Modal"
};
</script>

<style lang="scss" scoped>
.modal {
  background: white;
  height: 30vh;
  width: 30vw;
  position: absolute;
  left: 50vw;
  top: 50vh;
}
</style>