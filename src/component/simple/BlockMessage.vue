<template>
  <v-card :style="'background-color: ' +(dense ? '#f0f8ff' : 'lightyellow')" outlined :class="(dense ? 'body-2 pa-3' : 'body-1 pa-4 px-3')">
    <v-icon class="mr-1" :color="dense ? 'blue' : 'cyan'">mdi-information{{dense ? '-outline' : ''}}</v-icon>
    {{ message }}
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  props: {
    message: String,
    dense: {
      default: false,
      type: Boolean,
    }
  }
}
</script>
