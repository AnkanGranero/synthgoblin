<template>
  <div class="midi-channel">
    <span>Midi channel</span>
    <input v-model.number="midiChannel" type="number" min="1" max="16" class="midi_channel__input" />
  </div>
</template>

<script>
import {
  outputChannel,
  setOutputChannel
} from "../../midi-service/midiService";
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
  watch: {
    midiChannel: function(channel) {
      setOutputChannel(channel);
      localStorage.setItem("midiChannel", channel);
    }
  }
};
</script>

<style lang="scss">
.midi-channel {
  display: flex;
  justify-content: center;
  margin-top: 50px;

  &__option {
    margin-left: 15px;
  }
}
</style>

