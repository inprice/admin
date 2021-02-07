<template>
  <v-app>

    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="4000" 
      :color="snackbar.color"
      top
    >
      <v-icon left>mdi-shield-alert-outline</v-icon>
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          color="white"
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="warning.show"
      :max-width="findDialogWidth"
      :style="{ zIndex: 200 }"
      @keydown.esc="warning.show = false"
      overlay-opacity="0.2"
    >
      <v-card>
        <div class="white--text font-weight-bold pa-2 pl-3" style="background-color: #e77">
          {{ warning.title }}
        </div>

        <v-divider></v-divider>

        <v-card-text class="pa-4 black--text">
          <v-icon class="mr-1">mdi-help-circle-outline</v-icon>
          {{ warning.message }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn @click.native="warning.show = false" text class="mt-2">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <router-view></router-view>

  </v-app>
</template>

<script>
export default {
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
  data() {
    return {
      snackbar: {
        show: false,
        level: 'info',
        color: 'info',
        message: ''
      },
      warning: {
        show: false,
        title: 'Warning',
        message: ''
      }
    }
  },
  created() {
    this.$store.watch(state => state.snackbar.text, () => {
      if (this.$store.state.snackbar.text !== '') {
        this.snackbar.show = true;
        this.snackbar.message = this.$store.state.snackbar.text;
        this.snackbar.color = this.$store.state.snackbar.color;
        this.$store.commit('snackbar/setMessage', { text: '' });
      }
    });
    this.$store.watch(state => state.warning.text, () => {
      if (this.$store.state.warning.text !== '') {
        this.warning.show = true;
        this.warning.title = this.$store.state.warning.title;
        this.warning.message = this.$store.state.warning.text;
        this.$store.commit('warning/setMessage', { text: '' });
      }
    });
  },
}
</script>

<style>
  a {
    text-decoration: none;
  }
  pre {
    font-family: 'Courier New';
    font-size: 15px;
  }
  .v-list-item__action {
    margin-right: 22px !important;
  }
</style>