<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="close"
    overlay-opacity="0.2"
  >
    <v-card>
      <v-toolbar dense flat>
        <v-icon class="mr-2">mdi-shield-alert-outline</v-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        {{ message }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click.native="close" color="red lighten-1" dark class="mt-3 mb-2">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'notification',
  data: () => ({
    dialog: false,
    message: null,
    title: null,
    options: {
      width: 350,
      zIndex: 200
    }
  }),
  computed: {
    show: {
      get() {
        return this.dialog
      },
      set(value) {
        this.dialog = value
        if (value === false) {
          this.close()
        }
      }
    }
  },
  methods: {
    open(title, message, important, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
    },
    close() {
      this.dialog = false;
    }
  }
}
</script>
