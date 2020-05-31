<template>
  <div class="input-wrapper menu__option">
    <SliderContainer @enter="$emit('closeModal')">
      <div v-for="(key,index) in Object.keys(values)" :key="index" slot="sliderSlot">
        <Slider
          @changedValue="changedSliderValue"
          :type="key"
          :initialValue="12"
          :maxValue="25"
          :minValue="2"
          :integer="true"
        />
      </div>
    </SliderContainer>
  </div>
</template>
<script>
import Slider from "../Slider";
import SliderContainer from "../Slider/SliderContainer";
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
    x: {
      type: Number,
      default: 15
    },
    y: {
      type: Number,
      default: 15
    },
    arpeggio: {
      type: Array,
      default: () => []
    },
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
    }
  },
  methods: {
    /*     changedValue(payload) {
      this.$emit("changedValue", payload);
    }, */
    changedSliderValue({ val, type }) {
      this.values[type] = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  height: 100%;
  width: 100%;
  color: white;
  background: black;
  position: absolute;
  top: 0;
  left: 0;
}
.menu__option {
  font-size: 2rem;
  margin-bottom: 2rem;
  cursor: pointer;
  text-align: center;
}
.option {
  color: white;
}
</style>