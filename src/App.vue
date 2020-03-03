<template>
  <div id="app">
    <div class="overlay">
      <GridLayout @mouseEvent="clickHandler" @shoot="handleShoot" />
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

export default {
  name: "App",
  components: {
    GridLayout
  },
  mounted() {
    this.createAllPitchArrs();
  },
  data() {
    return {
      lydianScale: [1, 2, 2, 2, 1, 2, 2],
      allScales: [],
      index: 0
    };
  },
  computed: {},
  methods: {
    repeat() {
      let { index, allScales } = this;
      console.log(this);

      let steps = index % 8;
      let note = allScales[steps][steps];
      console.log(note);

      synth.triggerAttackRelease(note, "8n");
      this.index += 1;
    },
    handleShoot(payload) {
      console.log("payload", payload);

      /* 
      Tone.Transport.scheduleRepeat(this.repeat, "8n");
       Tone.Transport.start(); */

      let loop = new Tone.Sequence(
        function(time) {
          console.log("körs");

          synth.start(time, 0, "32n", 0, 0.5);
        },
        [0, 1, 2, 3],
        "8n"
      ).start(6);

      loop.start();

      /* let seq = new Tone.Sequence(this.loop, ["E3", "B3"], "4n"); */
    },

    whatRef(coordinates) {
      console.log("coordinates", coordinates);
    },

    handleMouseMove() {
      this.position.y = event.clientY;
      this.position.x = event.clientX;
      this.clickHandler(event);
    },
    hertzCalculator(n) {
      return Math.pow(2, n / 12) * 440;
    },
    createPitchArr(startKey) {
      let arr = [];
      let pianoKey = startKey;
      for (let i = 0; i <= 15; i++) {
        arr.push(this.hertzCalculator(pianoKey));
        pianoKey += this.lydianScale[i % 7];
      }
      return arr;
    },
    createAllPitchArrs() {
      let allArrs = [];
      let startKey = 0;

      for (let i = 0; i <= 15; i++) {
        let arr = this.createPitchArr(startKey);
        allArrs.push(arr);
        startKey += this.lydianScale[i % 7];
      }
      this.allScales = allArrs;
    },

    clickHandler(payload) {
      let pianoKey = this.allScales[payload.x][payload.y];

      if (payload.event === "mouseover") {
        synth.setNote(pianoKey);
      }
      if (payload.event === "mousedown") {
        synth.triggerAttack(pianoKey);
      } else if (payload.event === "mouseup") {
        synth.triggerRelease();
      }

      return;
    },

    async play() {
      await synth.start();
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
  background: black;
  z-index: -3;
}
</style>





