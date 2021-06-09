<template>
  <v-app>

    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="snackbar.timeout" 
      :color="snackbar.color"
      :top="!snackbar.centered"
      :centered="snackbar.centered"
    >
      <div v-if="snackbar.centered" class="text-center">
        <v-icon>mdi-shield-alert-outline</v-icon>
      </div>
      <v-icon v-else>mdi-shield-alert-outline</v-icon>
      <span class="font-weight-medium" :class="{'text-center d-block pt-3 pb-2': snackbar.centered}">
        {{ snackbar.message }}
      </span>
      <template v-slot:action="{ attrs }" v-if="snackbar.closeButton">
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

        <v-card-actions class="pt-0 justify-end">
          <v-btn
            text outlined
            class="mt-2"
            @click.native="warning.show = false"
          >
            OK
          </v-btn>
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
        default: return '18%';
      }
    },
  },
  data() {
    return {
      snackbar: {
        show: false,
        color: 'info',
        message: '',
        timeout: 3500,
        centered: false,
        closeButton: true,
      },
      warning: {
        show: false,
        title: 'Warning',
        message: ''
      }
    }
  },
  mounted() {
    this.$store.watch(state => state.snackbar.text, () => {
      const ref = this.$store.state.snackbar;
      if (ref.text !== '') {
        this.snackbar.message = ref.text;
        this.snackbar.color = ref.color;
        this.snackbar.timeout = ref.timeout;
        this.snackbar.centered = ref.centered;
        this.snackbar.closeButton = ref.closeButton;
        this.snackbar.show = true;
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

    //fetching system level messages!
    const self = this;
    function fetchSystemMessages() {
      if (self.$route.name != 'announce') { //no need to fetch here!
        self.$store.dispatch('message/fetchAnnounces');
      }
      setTimeout(fetchSystemMessages, 1 * 60 * 1000);
    }
    fetchSystemMessages();
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