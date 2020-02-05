<template>
  <div class="gridContainer">
    <div v-for="n in 14" :key="n" :class="createGridClass(n)">{{ n }}</div>
  </div>
</template>

<script>
export default {
  name: "GridLayout",
  methods: {
    createGridClass(n) {
      return `item item-${n}`;
    }
  }
};
</script>