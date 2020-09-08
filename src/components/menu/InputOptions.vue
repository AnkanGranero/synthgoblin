<template>
  <div class="input-options input-options__option">
    <SliderContainer @back="$emit('back')">
      <div v-for="(key,index) in Object.keys(values)" :key="index" slot="sliderSlot">
        <Slider
          v-if="inputType === 'slider'"
          @changedValue="changedSliderValue"
          :type="key"
          :initialValue="values[key]"
          :maxValue="gridMaxValue"
          :minValue="2"
          :integer="true"
        />
        <div v-else-if="inputType === 'textInput'" class="input-options__input-wrapper">
          <input
            v-model="values.arpeggio"
            @keypress="handleInput"
            class="input-options__text-input"
          />
          <p>write intervals in semitones</p>
          <span @click="changeArpeggio">ok</span>
        </div>
      </div>
    </SliderContainer>
  </div>
</template>
<script>
import Slider from "../Slider/Slider";
import SliderContainer from "../Slider/SliderContainer";
import { createAllArpeggios } from "../../utils/pitchCalculations";
import { mapState } from "vuex";
export default {
  name: "inputOptions",
  components: {
    Slider,
    SliderContainer
  },
  data() {
    return {
      values: this.initialValues
    };
  },
  props: {
    choosenField: {
      type: Array,
      default: () => []
    },
    inputOption: {
      type: String,
      default: ""
    },
    initialValues: {
      type: Object,
      default: () => {}
    },
    fields: {
      type: Object,
      default: () => {}
    },
    inputType: {
      type: String,
      default: ""
    }
  },
  methods: {
    changedSliderValue({ val, type }) {
      this.values[type] = val;
      this.$store.dispatch("setPlayingDiv", false);
      this.$store.dispatch("createAllArpeggios");
    },
    changeArpeggio() {
      let newArpeggio = this.values.arpeggio.split("").map(i => Number(i));
      this.$emit("changeArpeggio", newArpeggio);
    },
    handleInput(event) {
      let { charCode } = event;
      if ((charCode < 48 || charCode > 57) && charCode !== 0) {
        event.preventDefault();
      }
    }
  },
  computed: {
    ...mapState(["angle"]),
    gridSize() {
      return this.$store.getters.getGridSize;
    },
    arpeggio() {
      return this.$store.getters.getArpeggio;
    },
    gridMaxValue() {
      return this.$store.state.gridSize.maxValue;
    }
  }
};
</script>

<style lang="scss" scoped>
.input-options {
  height: 70%;
  width: 70%;
  color: white;
  background: black;
  position: absolute;
  top: 0;
  left: 0;

  &__input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: space-between;
  }

  &__text-input {
    width: 85%;
  }

  &__option {
    font-size: 2rem;
    margin-bottom: 2rem;
    cursor: pointer;
    text-align: center;
  }
}
</style>