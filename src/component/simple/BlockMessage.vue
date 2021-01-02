<template>
  <v-alert color="cyan lighten-2" text :value="true" :dense="dense" :elevation="dense ? 2 : 0" class="mb-0">
    <div class="black--text">
      <v-icon class="mr-1" color="pink lighten-2">mdi-information-outline</v-icon>
       {{ message }}
      <slot></slot>
    </div>
  </v-alert>
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
