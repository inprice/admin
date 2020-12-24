<template>
  <v-app>

    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="4500" 
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
          @click="closeSnackBar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      persistent
      v-model="warning.show"
      :max-width="350"
      :style="{ zIndex: 200 }"
      @keydown.esc="close"
      overlay-opacity="0.2"
    >
      <v-card>
        <v-toolbar dense flat>
          <v-icon class="mr-2">mdi-shield-alert-outline</v-icon>
          <v-toolbar-title>{{ warning.title }}</v-toolbar-title>
        </v-toolbar>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          {{ warning.message }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn @click.native="closeWarning" text class="mt-3 mb-2">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <router-view></router-view>

  </v-app>
</template>

<script>
export default {
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
  methods: {
    closeSnackBar() {
      this.snackbar.show = false;
    },
    closeWarning() {
      this.warning.show = false;
    }
  },
  watch: {
    '$route.path' () {
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
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