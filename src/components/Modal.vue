//skapa dynamisk komponent som har innehåll på den som vi valt och vi har
importerat alla dom som egna komponenter
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
  z-index: 3;
  width: 70%;
  left: 15%;
  background: $hagrid-green-background;
  border: 5px solid white;
  height: 70%;
  position: fixed;
  top: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (min-width: 600px) {
    width: 50%;
    left: 23%;
    height: 75%;
    top: 12.5%;
  }
  @media only screen and (min-width: 1024px) {
    width: 33%;
    left: 33%;
    top: 15%;
    height: 70%;
  }
}
</style>
