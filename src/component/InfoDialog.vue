<template>
  <v-dialog
    v-model="show"
    overlay-opacity="0.3"
    content-class="rounded-dialog"
    style="z-index: 100"
  >
    <v-card>
      <v-card-title class="pb-0 d-flex justify-space-between">
        <span>{{ title }}</span>
        <v-btn icon @click="close"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text class="py-0 mt-3">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end pa-3">
        <v-btn 
          text
          @click.native="close" 
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'info-dialog',
  data: () => ({
    show: false,
    message: null,
    title: null,
  }),
  methods: {
    open(title, message) {
      this.title = title;
      this.message = message;
      this.show = true;
    },
    close() {
      this.show = false;
    }
  },
}
</script>
