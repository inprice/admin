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
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <router-view></router-view>

  </v-app>
</template>

<script>
export default {
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
      },
      messageRefrefresherFunc: null,
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

    //fetching system level messages!
    if (this.messageRefrefresherFunc == null) {
      const self = this;
      this.messageRefrefresherFunc = () => {
        if (self.$route.params.sid != undefined && self.$route.name != 'announce') {
          self.$store.dispatch('message/fetchAnnounces');
        }
        setTimeout(this.messageRefrefresherFunc, 5 * 60 * 1000);
      }
      this.messageRefrefresherFunc();
    }
  },
  watch: { 
    '$route.params.sid': {
        handler: function(sid) {
          if (sid != undefined) {
            this.$store.commit('session/CHANGE_CURRENT', sid);
            this.$store.dispatch('message/fetchAnnounces');
          }
        },
      }
  }
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