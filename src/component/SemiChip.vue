<template>
  <v-alert
    dense
    outlined
    :color="bgColor"
    class="pa-0"
  >
    <div v-if="dir == 'ltr'">
      <strong :style="{ color: tagColor, backgroundColor: bgColor }">{{ tag }}</strong><span :style="{ color: fgColor || bgColor }">{{ value }}</span>
    </div>
    <div v-else>
      <span :style="{ color: fgColor || bgColor }">{{ value }}</span><strong :style="{ color: tagColor, backgroundColor: bgColor }">{{ tag }}</strong>
    </div>
  </v-alert>
</template>

<script>
export default {
  name: 'semi-chip',
  props: {
    tag: {
      type: String
    },
    value: {
      type: String
    },
    dir: {
      type: String,
      default: 'ltr'
    },
    fgColor: {
      type: String
    },
    tagColor: {
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
  .v-alert__content {
    flex: none;
  }
  .v-alert__content strong {
    display: inline-table;
    padding: 0 7px;
  }
  .v-alert__content span {
    padding: 0 7px;
  }
</style>
