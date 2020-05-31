<template>
  <span>
    <strong :class="color+'--text'">{{ formatted }}</strong> <v-icon color="orange">mdi-{{dir}}</v-icon>
  </span>
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
        if (this.diff > 0) return 'success';
        if (this.diff < 0) return 'red';
      }
      return 'gray';
    },
    formatted() {
      return numFormatter('###0.00%', this.diff);
    }
  }
}
</script>

<style scopped>

</style>