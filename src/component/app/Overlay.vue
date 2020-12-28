<template>
  <v-overlay :value="show">
    <v-card>
      <div style="background-color: white; height: 100px; width: auto" class="my-auto px-5 py-3 d-flex">
        <v-progress-circular
          indeterminate
          size="40"
          class="ml-2 my-auto"
          color="grey darken-1"
        ></v-progress-circular>
        <h3 class="my-auto subtitle-1 black--text ml-5">Please wait, {{ status }}...</h3>
        <!-- <v-btn class="my-auto ml-7" small color="orange" @click="$emit('cancelled')">Cancel</v-btn> -->
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
