<template>
  <div id="app">
    <div class="overlay" @mousedown="clickHandler" @mouseup="clickHandler"></div>
  </div>
</template>

<script>
import * as Tone from "tone";
export default {
  name: "App",
  data() {
    return {
      arrOfNotes: [
        "C3",
        "D3",
        "E3",
        "F#3",
        "G3",
        "A3",
        "B3",
        "C4",
        "D4",
        "E4",
        "F#4",
        "G4",
        "A4",
        "B4",
        "C5",
        "D5",
        "E5",
        "F#5",
        "G5",
        "A5",
        "B5"
      ]
    };
  },
  computed() {},
  methods: {
    clickHandler() {
      let total = document.body.scrollHeight;
      let westernScale = total / 14;
      let myPos = event.screenY;
      let steps = Math.round(myPos / westernScale) - 1;
      //olika skalor på x axeln

      const synth = new Tone.Synth().toMaster();
      if (event.type === "mousedown") {
        console.log("mouseDown");

        synth.triggerAttack(this.arrOfNotes[steps], "8n");
        this.play();
      } else if (event.type === "mouseup") {
        console.log("mouseUp");

        synth.triggerRelease();
      }

      /*       document.querySelector("overlay").addEventListener("mouseup", () => {
        console.log("hej");

        synth.triggerRelease();
      }); */

      return this.document;
    },

    async play() {
      await Tone.start();
      console.log("audio is ready");
    }
  }
};
</script>
<style>
@import url("https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap");

.overlay {
  height: 100vh;
  width: 100vw;
  background: red;
}
</style>
