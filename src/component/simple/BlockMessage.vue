<template>
  <v-alert type="info" color="info" text tile :value="true" :dense="dense" :elevation="dense ? 2 : 0">
    <div class="black--text">
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
