<template>
  <div class="header" :class="'header__' + getColorTheme">
    <div class="header__empty"></div>
    <div class="header__center">
      <h1 class="header__h1">Hagrid</h1>
      <p class="header__sub">grid sequencer</p>
    </div>
    <img
      v-if="getColorTheme === 'classic'"
      class="header__leaf"
      :class="'header__leaf-' + getColorTheme"
      src="../assets/blad.svg"
      alt="leaf"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CHeader",

  computed: {
    ...mapGetters(["getColorTheme"])
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: none;
  @media only screen and (min-width: $ipad) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
    position: relative;
    justify-content: center;
    margin: 5% 0;
    margin-bottom: 13%;
  }
  &__darkStar {
    /*  display: none; */
    @media only screen and (min-width: $ipad) {
      margin-bottom: 6%;
      margin-top: 0;
    }
    .header__h1 {
      color: $yellowMedium;
      margin: 0;
      letter-spacing: -0.4rem;
      line-height: 0.8;
      font-size: 8rem;
      @media only screen and (min-width: $laptop) {
        font-size: 10rem;
      }
    }
    .header__sub {
      color: white;
      font-size: 1.3rem;
      @media only screen and (min-width: $laptop) {
        font-size: 1.5rem;
      }
    }
    .header__leaf {
      display: none;
    }
  }

  &__h1 {
    color: #d9d283;
    margin: 0;
    letter-spacing: -0.4rem;
    line-height: 0.8;
    font-size: 12.5vw;
    font-size: 12.9rem;
  }
  &__sub {
    margin: 0;
    padding: 0;
    top: -57px;
    left: 13px;
    margin-left: 2%;
    font-size: 1.7vw;
  }
  &__leaf {
    display: none;
    @media only screen and (min-width: 768px) {
      display: unset;
      height: 19vw;
      position: absolute;
      bottom: 0;
      top: 56%;
      right: -11%;
    }
    @media only screen and (min-width: 1024px) {
      right: 0;
    }
  }
  &__middle {
    width: 50%;
  }
  &__left,
  &__leaf {
    flex-grow: 1;
  }
}
</style>