<template>
  <v-card :style="'background-color: ' +(dense ? '#f0f8ff' : 'lightyellow')" outlined :class="(dense ? 'body-2 pa-2' : 'body-1 pa-4 px-3')">
    <v-progress-circular
      v-if="loading"
      color="green"
      class="mr-1"
      indeterminate
    ></v-progress-circular>    

    <v-icon v-else class="mr-1" :color="dense ? 'blue' : 'cyan'">mdi-information{{dense ? '-outline' : ''}}</v-icon>
    {{ message }}
    <slot></slot>
  </v-card>
</template>

<script>
export default {
  props: {
    message: String,
    loading: {
      default: false,
      type: Boolean,
    },
    dense: {
      default: true,
      type: Boolean,
    }
  }
}
</script>
