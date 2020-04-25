<template>
  <div>
    <div class="display-1">
      Settings
    </div>

    <p class="subtitle mt-4 mb-8">
      You are seeing <strong>{{ session.user }}</strong>({{ session.email }}) settings page.
    </p>

    <profile />
    <sessions class="mt-5" />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    session: get('session/session'),
  },
  components: {
    Profile: () => import('./Profile'),
    Sessions: () => import('./Sessions')
  }
};
</script>
