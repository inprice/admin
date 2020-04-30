<template>
  <div>
    <div class="display-1">
      Settings
    </div>

    <p class="subtitle mt-4 mb-8">
      You are seeing <strong>{{ session.company }}</strong> settings page.
    </p>

    <profile />
    <members />

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
    Members: () => import('./Members')
  }
};
</script>
