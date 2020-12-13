<template>
  <div>
    <div class="title pl-1 mb-2">
      {{ session.company }} Settings
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
    session: get('auth/session'),
  },
  components: {
    Profile: () => import('./Profile'),
    Users: () => import('./Users'),
    DeleteEverything: () => import('./DeleteEverything')
  }
};
</script>