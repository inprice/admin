<template>
  <v-dialog
    v-model="show"
    :max-width="findDialogWidth"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
    overlay-opacity="0.2"
  >
    <v-card>
      <div class="d-flex justify-space-between pa-4 pb-1">
        <span class="title">{{ title }}</span>
        <v-btn icon @click="cancel"><v-icon>mdi-close</v-icon></v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-text v-show="!!message" class="pa-4"><strong v-show="!!important">{{ important }} </strong>{{ message }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn @click.native="agree" text outlined>Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirm',
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
    },
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '18%';
      }
    },
  },
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
  methods: {
    open(title, message, important, options) {
      this.dialog = true
      this.title = title
      this.important = important
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
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
  },
}
</script>
