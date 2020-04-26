<template>
  <v-dialog
    v-model="show"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-alert-circle-outline</v-icon>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text v-show="!!message" class="pa-4"><strong v-show="!!important">{{ important }} </strong>{{ message }}</v-card-text>

      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn @click.native="agree" color="grey" text>Yes</v-btn>
        <v-btn @click.native="cancel" color="primary darken-1" text>Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirm',
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    important: null,
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
          this.cancel()
        }
      }
    }
  },
  methods: {
    open(title, message, important, options) {
      this.dialog = true
      this.title = title
      this.important = important
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
