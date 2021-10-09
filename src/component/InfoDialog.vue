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

      <v-card-text class="py-0 mt-3" v-html="html" v-if="html"></v-card-text>
      <v-card-text class="py-0 mt-3" v-else>
        {{ text }}
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
    text: null,
    html: null,
    title: null,
  }),
  methods: {
    open(title, text, html) {
      this.title = title;
      this.text = text;
      this.html = html;
      this.show = true;
    },
    close() {
      this.show = false;
    }
  },
}
</script>
