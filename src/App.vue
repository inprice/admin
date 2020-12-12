<template>
  <v-app>

    <v-snackbar 
      v-model="snackbar.show" 
      :timeout="3500" 
      :color="snackbar.color"
      top
    >
      <v-icon left>mdi-alert-circle-outline</v-icon>
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
  },
  watch: {
    '$route.path' () {
      typeof window !== 'undefined' && window.scrollTo(0, 0)
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