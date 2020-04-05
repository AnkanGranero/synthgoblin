//skapa dynamisk komponent som har innehåll på den som vi valt och vi har importerat alla dom som egna komponenter 
<template>
  <div class="modal">
    <Menu @menuEmit="modalEmit" />
  </div>
</template>
<script>
import Menu from "./menu/Menu";
export default {
  name: "Modal",
  data() {
    return {};
  },
  components: {
    Menu
  },
  methods: {
    modalEmit(payload) {
      this.$emit("modalEmit", payload);
    }
  }
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