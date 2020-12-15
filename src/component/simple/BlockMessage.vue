<template>
  <v-alert type="info" color="info" text tile :value="true">
    <div class="black--text">
      {{ message }}
      <slot></slot>
    </div>
  </v-alert>
</template>

<script>
export default {
  props: {
    message: String
  }
}
</script>
