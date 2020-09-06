<template>
  <div class="midi-channels">
    <input
      v-model.number="midiChannel"
      type="number"
      min="1"
      max="16"
      class="midi_channels__input"
    />
  </div>
</template>

<script>
import { outputChannel, setOutputChannel } from "../../midi-service/midiService";
export default {
  name: "MidiOut",
  data() {
    return {
      midiChannel: 1
    };
  },
  mounted() {
    this.midiChannel = outputChannel; // Get current midi output channel
  },
  watch : {
    midiChannel : function(channel) {
      setOutputChannel(channel);
      localStorage.setItem("midiChannel", channel);
    }
  }
};
</script>

<style lang="scss">
.midi-channel {
  height: 70%;
  width: 70%;
  color: white;
  background: black;
  position: absolute;
  top: 0;
  left: 0;

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

