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
$hagridGreen: #54bb5a;

.modal {
  width: 50%;
  left: 23%;
  background: $hagridGreen;
  border: 5px solid white;
  height: 50%;
  position: fixed;
  top: 26%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 375px) {
    width: 33%;
    left: 33%;
    height: 50%;
  }
}
</style>
