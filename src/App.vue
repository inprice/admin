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

    <notification ref="notification"></notification>

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
      }
    }
  },
  created() {
    this.$store.watch(state => state.snackbar.text, () => {
      if (this.$store.state.snackbar.text !== '') {
        //this.snackbar.level = this.$store.state.snackbar.level;
        //if (this.snackbar.level == 'info') {
          this.snackbar.show = true;
          this.snackbar.message = this.$store.state.snackbar.text;
          this.snackbar.color = this.$store.state.snackbar.color;
        //} else {
        //  this.snackbar.message = this.$store.state.snackbar.text;
        //  this.$refs.notification.open('Info', this.snackbar.message);
        //}
        this.$store.commit('snackbar/setMessage', { text: '' });
      }
    });
  },
  methods: {
    closeSnackBar() {
      this.snackbar.show = false;
    }
  },
  watch: {
    '$route.path' () {
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    }
  },
  components: {
    Notification: () => import('@/component/Notification.vue'),
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