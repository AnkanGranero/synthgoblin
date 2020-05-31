<template>
  <div class="slider-container">
    <div class="slot-container">
      <slot name="sliderSlot" />
    </div>
    <div class="btn-wrapper">
      <span @click="$emit('back')">back</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderContainer"
};
</script>
<style lang="scss">
$medium: 768px;

.slider-container {
  display: flex;
  height: 100%;
  justify-content: space-around;
  flex-direction: column;
  /*  width: 48%; */
}
.slot-container {
  display: flex;
  flex-grow: 3;
  justify-content: space-around;
  margin-top: 15%;
}
.btn-wrapper {
  flex-grow: 1;
  margin-top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>