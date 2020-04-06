<template>
  <v-alert
    dense
    outlined
    color="indigo"
    class="pa-0 mb-0 mt-2 mr-2 caption"
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
    padding-left: 7px;
    padding-right: 7px;
  }
  .v-alert__content > span {
    padding-left: 7px;
    padding-right: 7px;
  }
</style>
