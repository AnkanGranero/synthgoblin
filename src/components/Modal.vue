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
  background: black;
  border: 5px solid white;
  height: 33%;
  width: 33%;
  position: absolute;
  left: 33%;
  top: 30%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>