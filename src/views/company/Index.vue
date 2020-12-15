<template>
  <div>
    <div class="title pl-1 mb-2">
      {{ CURSTAT.company }} Settings
    </div>

    <profile />
    <users />
    <delete-everything />

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
    DeleteEverything: () => import('./DeleteEverything')
  }
};
</script>