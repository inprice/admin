<template>
  <div class="d-flex justify-center">
    <div>{{ formatted }}</div>
    <v-icon :style="$vuetify.breakpoint.name == 'xs' || smallicon ? 'font-size: 95%' : ''" :color="color">mdi-{{ dir }}-circle</v-icon>
  </div>
</template>

<script>
import numFormatter from 'number-format.js';

export default {
  props: {
    diff: {
      type: Number,
      default: 0
    },
    smallicon: {
      type: Boolean,
      default: false
    }
  },
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
