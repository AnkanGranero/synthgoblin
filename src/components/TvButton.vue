<template>
  <div class="tv-button" :class="colorTheme">
    <slot />
  </div>
</template>

<script>
export default {
  name: "TvButtonComponent",
  props: {
    value: {
      type: String,
      default: "sine",
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    colorTheme() {
      return this.$store.getters.getColorTheme;
    },
  },
};
</script>
<style lang="scss">
.tv-button {
  display: flex;
  justify-content: center;
  margin: 6%;
  stroke-miterlimit: 10;
  fill: none;

  &__btn {
    height: 60px;
    width: 60px;
    border-radius: 10%;
    box-sizing: border-box;

    @media only screen and (min-width: $ipad) {
      width: 100%;
      height: unset;
      /* width: 36%; */
    }
  }
  .active {
    background: $tv-button-active;
    stroke: $dark-stroke;
  }
}

.classic {
  .default {
    stroke: $dark-stroke;
    background: rgb(121, 208, 132);
    @media only screen and (min-width: $ipad) {
      &:hover {
        background: rgb(141, 223, 232);
        border: none;
        stroke: black;
      }
    }
  }
}
.darkStar {
  .default {
    stroke: $light-stroke;
    background: black;
    border: solid 1px white;
    @media only screen and (min-width: $ipad) {
      &:hover {
        background: rgb(141, 223, 232);
        border: none;
        stroke: black;
      }
    }
  }
  .active {
    background: $hagrid-light;
  }
}
.yellowOrchestra {
  .default {
    stroke: $dark-stroke;
    background: rgb(121, 208, 132);
    border: solid 1px black;
    @media only screen and (min-width: $ipad) {
      &:hover {
        background: rgb(141, 223, 232);
        border: none;
        stroke: black;
      }
    }
  }
}
</style>