<template>
  <div>
    <div class="display-1">
      Settings
    </div>

    <p class="subtitle mt-4 mb-8">
      You are seeing <strong>{{ session.user }}</strong>({{ session.email }}) settings page.
    </p>

    <profile />
    <invitations @accept="acceptInvitation"/>
    <memberships ref="memberships"/>
    <sessions/>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    session: get('session/session'),
  },
  methods: {
    acceptInvitation() {
      this.$refs.memberships.refreshMemberships();
    }
  },
  components: {
    Profile: () => import('./Profile'),
    Invitations: () => import('./Invitations'),
    Memberships: () => import('./Memberships'),
    Sessions: () => import('./Sessions')
  }
};
</script>
