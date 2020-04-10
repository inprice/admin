<template>
  <v-alert
    dense
    outlined
    :color="bgColor"
    class="pa-0"
  >
    <strong :style="{ color: fgColor, backgroundColor: bgColor }">{{ tag }}</strong><span>{{ value }}</span>
  </v-alert>
</template>

<script>
export default {
  name: 'semi-tag',
  props: {
    tag: {
      type: String
    },
    value: {
      type: String
    },
    fgColor: {
      type: String,
      default: 'white'
    },
    bgColor: {
      type: String,
      default: 'teal'
    }
  }
}
</script>

<style scoped>
  .v-alert__content > strong {
    display: inline-block;
    padding: 0 7px;
  }
  .v-alert__content > span {
    padding: 0 7px;
  }
</style>
