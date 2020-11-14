<template>
  <div>
    <div class="title pl-1 mb-2">
      User Settings
    </div>

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
    session: get('auth/session'),
  },
  methods: {
    acceptInvitation() {
      this.$refs.memberships.refreshMembers();
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
