<template>
  <v-dialog
    v-model="show"
    :max-width="findDialogWidth"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="show = false"
    overlay-opacity="0.2"
  >
    <v-card>
      <div class="d-flex justify-space-between pa-4 pb-1">
        <span class="title">{{ title }}</span>
        <v-btn icon @click="show = false"><v-icon>mdi-close</v-icon></v-btn>
      </div>

      <v-divider></v-divider>

      <v-card-text v-show="!!message" class="pa-4">{{ message }}</v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-end">
        <v-btn @click.native="show = false" text outlined>OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'confirm',
  computed: {
    findDialogWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '80%';
        case 'sm': return '50%';
        case 'md': return '35%';
        case 'lg': return '27%';
        default: return '16%';
      }
    },
  },
  data: () => ({
    show: false,
    message: null,
    title: null,
    options: {
      width: 350,
      zIndex: 200
    }
  }),
  methods: {
    open(title, message, important, options) {
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      this.show = true;
    },
  },
}
</script>
