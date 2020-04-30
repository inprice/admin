<template>
  <div>
    <div class="display-1">
      Settings
    </div>

    <p class="subtitle mt-4 mb-8">
      You are seeing <strong>{{ session.company }}</strong> settings page.
    </p>

    <profile />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    session: get('session/session'),
  },
  components: {
    Profile: () => import('./Profile')
  }
};
</script>
