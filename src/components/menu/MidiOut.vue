<template>
  <div>
    <p @click="setMidiOutputs()">MIDI</p>
    <ul>
      <li
        v-for="(output, index) in midiOutputs"
        :key="index"
        @click="setMidiOutput(output)"
      >{{ output.name}}</li>
    </ul>
  </div>
</template>

<script>
import { requestMIDIAccess } from "../../midi-service/midiService";
export default {
  name: "MidiOut",
  data() {
    return {
      midiOutputs: []
    };
  },
  methods: {
    requestMIDIAccess,
    setMidiOutputs() {
      this.requestMIDIAccess().then(resp => (this.midiOutputs = resp));
    },
    setMidiOutput(payload) {
      this.$store.dispatch("addMidiOutput", payload);
      localStorage.setItem("midiOutput", payload.name);
      this.$store.dispatch("modalIsOpen", false);
    }
  }
};
</script>

<style lang="scss">
</style>