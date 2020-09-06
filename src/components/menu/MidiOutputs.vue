<template>
  <div class="midi-out">
    <ul class="midi-out__options">
      <li
        v-for="(output, index) in midiOutputs"
        :key="index"
        class="midi-out__option"
        @click="setMidiOutput(output)"
      >{{ output.name}}</li>
    </ul>
  </div>
</template>

<script>
import { midiOutputs, setOutputDevice } from "../../midi-service/midiService";
export default {
  name: "MidiOut",
  data() {
    return {
      midiOutputs: []
    };
  },
  async mounted() {
    this.midiOutputs = await midiOutputs;
  },
  methods: { setMidiOutput(payload) {
      this.$store.dispatch("addMidiOutput", payload);
      setOutputDevice(payload);
      localStorage.setItem("midiOutput", payload.name);
      this.$store.dispatch("modalIsOpen", false);
    }
  }
};
</script>

<style lang="scss">
.midi-out {
  &__options {
    list-style: none;
    padding: 0;
    margin-top: 70px;
  }
  &__option {
    font-size: 20px;
    margin-bottom: 2rem;
    cursor: pointer;
    text-align: center;
    @media only screen and (min-width: 1200px) {
      font-size: 40px;
    }
  }
}
</style>

