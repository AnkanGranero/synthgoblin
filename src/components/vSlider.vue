<template>
  <v-app id="override" height="100" max-height="100" min-height="100" light>
    <span class="bpm">{{ bpm }}</span>
    <v-slider
      class="override"
      v-model="bpm"
      vertical
      track-color="#54bb5a"
      color="#54bb5a"
      thumb-color="#d9d283"
      thumb-size="500"
    />
  </v-app>
</template>
<script>
import { VSlider } from "vuetify/lib";
export default {
  name: "sliders",
  components: {
    VSlider
  },
  data() {
    return {
      bpm: 100
    };
  },
  methods: {
    changeMousePos(event) {
      console.log("mouseEvent", event);
    },
    mouseHandler() {
      let ref = this.$refs["knob"];
      console.log("ref", ref);

      ref.style.borderradius = "50%";
    }
  },
  computed: {
    knobPosition() {
      return { top: `${100 - this.slideValue}%` };
    }
  }
};
</script>
<style lang="scss" scoped>
#app {
  position: relative;
  height: 100%;
  max-height: 100% !important;
  min-height: 100% !important;
  background: black;
}
.bpm {
  color: white;
}

#override {
  position: relative;
  height: 100%;
  max-height: 100% !important;
  min-height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  background: black;
}
.application--wrap {
  min-height: 100% !important;
  max-height: 100% !important;
}

.slidecontainer {
  height: 100%;
  display: flex;

  &__twin {
    height: 100%;
    background: red;
    width: 5px;
  }
  &__knob {
    background: yellow;
    width: 10px;
    height: 10px;
    position: relative;
  }
}
</style>
