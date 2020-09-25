<template>
  <div class="wave">
    <slot />
  </div>
</template>

<script>
export default {
  name: "TvButtonComponent",
  props: {
    value: {
      type: String,
      default: "sine"
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  components: {}
};
</script>
<style lang="scss">
$hagridGreen: #54bb5a;
$blue: rgb(141, 223, 232);
$yellow: #d9d283;

.wave {
  display: flex;
  justify-content: center;
  margin: 2%;

  &__btn {
    height: 70px;
    width: 70px;
    height: 100%;
    width: 25%;
    background: $hagridGreen;
    border-radius: 10%;
    box-sizing: border-box;
    @media only screen and (min-width: 2300px) {
      width: 36%;
    }
  }
}
</style>