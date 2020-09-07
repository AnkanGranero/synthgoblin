<template>
  <div class="midi-note-properties">
    <input
      v-model.number="velocity"
      type="number"
      min="0"
      max="1"
      class="midi-note-properties__input"
    />
    <input
      v-model.number="noteLength"
      type="number"
      min="0"
      max="1"
      class="midi-note-properties__input"
    />
  </div>
</template>

<script>
import { velocity, noteLength, changeMidiVelocity, changeMidiNoteLength } from "../../midi-service/midiService";
export default {
  name: "MidiOut",
  data() {
    return {
      velocity: 1,
      noteLength: 1
    };
  },
  mounted() {
    this.velocity = velocity;
    this.noteLength = noteLength;
  },
  watch : {
    velocity : function(newVelocity) {
      changeMidiVelocity(newVelocity);
    },
    noteLength : function(newNoteLength) {
      changeMidiNoteLength(newNoteLength);
    }
  }
};
</script>

<style lang="scss">
.midi-note-properties {
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

