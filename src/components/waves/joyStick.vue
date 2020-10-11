

<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 57 56.9"
    style="enable-background:new 0 0 57 56.9;"
    xml:space="preserve"
    :class="whatClass"
    @click="toggleJoystickMode"
  >
    <g id="knapp2">
      <path class="st1" d="M92.7,224.8" />
      <rect x="20.8" y="20.5" class="st2" width="15.6" height="15.6" />
      <circle class="st2" cx="28.6" cy="28.3" r="5.3" />
      <rect x="36.4" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="5" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="20.7" y="20.5" class="st2" width="15.6" height="15.6" />
      <rect x="20.8" y="4.9" class="st2" width="15.6" height="15.6" />
      <rect x="20.8" y="36.3" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="28.6,8.5 23.9,16.5 33.2,16.5 	" />
      <rect x="20.7" y="36.3" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="28.6,48.3 33.2,40.2 23.9,40.2 	" />
      <rect x="36.4" y="20.5" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="48.4,28.3 40.3,23.7 40.3,33 	" />
      <rect x="5" y="20.6" class="st2" width="15.6" height="15.6" />
      <polygon class="st2" points="8.6,28.3 16.7,33 16.7,23.7 	" />
    </g>
    <g id="knapp"></g>
  </svg>
</template>


<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "joyStick",
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(["toggleJoystickMode"])
  },
  computed: {
    ...mapGetters(["getJoystickMode"]),
    whatClass() {
      return this.getJoystickMode ? "active" : "default";
    }
  }
};
</script>




<style lang="scss" scoped>
.default {
  fill: $tv-button-active;
}
.st1 {
  stroke-miterlimit: 10;
}

.st2 {
  fill: none;
  stroke-miterlimit: 10;
}
</style>