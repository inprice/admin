<template>
  <div>
    <div class="display-1">
      Settings
    </div>

    <p class="subtitle mt-4 mb-8">
      You are seeing <strong>{{ session.company }}</strong> settings page.
    </p>

    <profile />
    <users />
    <coupons :status="session.subsStatus" />

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
    Coupons: () => import('./Coupons'),
    DeleteEverything: () => import('./DeleteEverything')
  }
};
</script>