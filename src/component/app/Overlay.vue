<template>
  <v-overlay :value="show">
    <v-card>
      <div style="background-color: white; width: 300px" class="my-auto pa-5">
        <v-progress-circular
          indeterminate
          size="40"
          class="ml-2"
          color="grey darken-1"
        ></v-progress-circular>
        <h3 class="d-inline subtitle-1 black--text ml-5">Please wait, {{ status }}...</h3>
      </div>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'processing',
    }
  }
}
</script>
