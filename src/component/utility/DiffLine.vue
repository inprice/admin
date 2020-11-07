<template>
  <div class="d-flex justify-center">
    <div>{{ formatted }}</div>
    <v-icon class="ml-1" :color="color">mdi-{{ dir }}-circle</v-icon>
  </div>
</template>

<script>
import numFormatter from 'number-format.js';

export default {
  props: ['diff'],
  computed: {
    dir() {
      if (this.diff != 0) {
        if (this.diff > 0) return 'arrow-up';
        if (this.diff < 0) return 'arrow-down';
      }
      return 'minus';
    },
    color() {
      if (this.diff != 0) {
        if (this.diff > 0) return 'red';
        if (this.diff < 0) return 'green';
      }
      return 'grey';
    },
    formatted() {
      return numFormatter('###0.00%', Math.abs(this.diff));
    }
  }
}
</script>

<style scopped>

</style>