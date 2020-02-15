<template>
  <div id="app">
    <div
      class="overlay"
      @mousedown="clickHandler"
      @mouseup="clickHandler"
      @mousemove="handleMouseMove"
    >
      <GridLayout :clicked="calcPos" />
    </div>
  </div>
</template>

<script>
import * as Tone from "tone";
import GridLayout from "./components/GridLayout";
let synth = new Tone.Synth({
  oscillator: {
    type: "square",
    modulationFrequency: 0.2
  },
  envelope: {
    attack: 0.02,
    decay: 0.1,
    sustain: 0.2,
    release: 0.2
  }
}).toMaster();
/* let synth = new Tone.PolySynth(4, Tone.synth).toMaster(); */
export default {
  name: "App",
  components: {
    GridLayout
  },
  data() {
    return {
      position: { x: "", y: "" },
      scales: {
        C: ["C", "D", "E", "F#", "G", "A", "B"],
        D: ["D", "E", "F#", "G#", "A", "B", "C"],
        E: ["E", "F#", "G#", "A#", "B", "C#", "D#"],
        Fsharp: ["F#", "G#", "A#", "B#", "C#", "D#", "E#"],
        G: ["G", "A", "B", "C#", "D", "E", "F#"],
        A: ["A", "B", "C#", "D#", "E", "F#", "G#"],
        B: ["B", "C#", "D#", "E#", "F#", "G#", "A#"],
        Coctave: ["C", "D", "E", "F#", "G", "A", "B"]
      }
    };
  },
  computed: {
    calcPos() {
      let totalY = document.body.scrollHeight;
      let dividedY = totalY / 14;
      let myYPos = this.position.y;
      let ySteps = Math.round(myYPos / dividedY);
      console.log("steps", isNaN(ySteps) ? 1 : ySteps);

      return { y: isNaN(ySteps) ? 1 : ySteps };
    }
  },

  methods: {
    scale(number) {
      let arr = ["C", "D", "E", "Fsharp", "G", "A", "B", "Coctave"];
      return arr[number];
    },
    handleMouseMove() {
      this.position.y = event.clientY;
      this.position.x = event.clientX;
      this.clickHandler(event);
    },
    clickHandler() {
      let totalY = document.body.scrollHeight;
      let totalX = document.body.scrollWidth;
      let westernScale = totalY / 14;
      let xModes = totalX / 7;
      let xMode = Math.round(this.position.x / xModes);
      let myPos = this.position.y;
      let ySteps = Math.round(myPos / westernScale);
      let stepsXY = ySteps + xMode;
      let index = ySteps % 7;
      let octave = Math.floor(stepsXY / 7) + 2;

      let calcScale = this.scale(xMode);
      let note = this.scales[calcScale][index] + octave;

      console.log("Octave", octave, note);

      //olika skalor på x axeln

      if (event.type === "mousemove") {
        synth.setNote(note);
      }

      if (event.type === "mousedown") {
        synth.triggerAttack(note);
      } else if (event.type === "mouseup") {
        synth.triggerRelease();
      }

      return this.document;
    },

    async play() {
      await synth.start();
      console.log("audio is ready");
    },
    updatePos(event) {
      this.position = event.screenY;
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
