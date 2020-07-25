<template>
  <div>
    <div class="display-1">
      Billing
    </div>

    <info />

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
export default {
  computed: {
    session: get('auth/session'),
  },
  components: {
    Info: () => import('./Info'),
  }
};
</script>