<template>
  <div>
    <div>
      <div class="title">{{ CURSTAT.user }}</div>
      <div class="body-2">User settings and sessions info.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

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
    CURSTAT: get('auth/CURRENT_STATUS'),
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
