<template>
  <div>
    <div>
      <div class="title">{{ CURSTAT.account }}</div>
      <div class="body-2">Account settings.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <profile />
    <users />
    <delete-account />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  components: {
    Profile: () => import('./Profile'),
    Users: () => import('./Users'),
    DeleteAccount: () => import('./DeleteAccount')
  }
};
</script>