<template>
  <div>
    <div class="title pl-1 mb-2">
      {{ CURSTAT.account }} Settings
    </div>

    <profile />
    <users />
    <delete-account />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('auth/CURRENT_STATUS'),
  },
  components: {
    Profile: () => import('./Profile'),
    Users: () => import('./Users'),
    DeleteAccount: () => import('./DeleteAccount')
  }
};
</script>