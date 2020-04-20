<template>
  <v-app>
    <notifications group="error" :duration="3000" :width="400" position="top center" />
    <notifications group="info" :duration="4000" :width="400" position="top center" />
    <notifications group="short-info" :duration="1800" :width="400" position="top center" />
    <router-view />
  </v-app>
</template>

<script>
export default {
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
</style>