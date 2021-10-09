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
        <v-btn icon @click="cancel"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text v-show="!!message" class="py-0 mt-3">
        <strong v-show="!!important">{{ important }} </strong>{{ message }}
      </v-card-text>

      <v-card-actions class="justify-end pa-3">
        <v-btn 
          text
          @click.native="agree"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirm-dialog',
  data: () => ({
    show: false,
    title: null,
    important: null,
    message: null,
    resolve: null,
    reject: null,
  }),
  methods: {
    open(title, message, important) {
      this.title = title;
      this.important = important;
      this.message = message;
      this.show = true;
      return new Promise((res, rej) => {
        this.resolve = res;
        this.reject = rej;
      })
    },
    agree() {
      this.resolve(true)
      this.show = false
    },
    cancel() {
      this.resolve(false)
      this.show = false
    }
  },
}
</script>
