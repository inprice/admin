<template>
  <span
    :class="findLevelColor(level) +'--text caption font-weight-medium'"
  >
    <v-icon small :color="findLevelColor(level)">mdi-star</v-icon>
    {{ level }}
    <v-icon small :color="findLevelColor(level)">mdi-star</v-icon>
  </span>
</template>

<script>
export default {
  props: ['level']
}
</script>
