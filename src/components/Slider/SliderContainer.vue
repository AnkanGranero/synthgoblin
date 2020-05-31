<template>
  <div class="slider-container">
    <div class="slot-container">
      <slot name="sliderSlot" />
    </div>

    <span class="enter-btn" @click="$emit('closeModal')">close</span>
    <span>close</span>
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
.enter-btn {
  flex-grow: 1;
  margin-top: 20%;
}
</style>