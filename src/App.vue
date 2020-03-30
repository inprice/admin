<template>
  <v-app>
    <notifications group="error" :duration="3000" :width="400" position="top center" />
    <notifications group="info" :duration="4000" :width="400" position="top center" />
    <notifications group="short-info" :duration="1800" :width="400" position="top center" />
    <router-view />
    <confirm ref="confirm"></confirm>
  </v-app>
</template>

<script>
/* eslint-disable no-unused-vars */
import confirm from './component/Confirm.vue'

export default {
  components: {
    confirm
  },
  watch: {
    '$route.path' () {
      typeof window !== 'undefined' && window.scrollTo(0, 0)
    },
  },
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open
  }
}
</script>

<style>
  a {
    text-decoration: none;
  }
</style>