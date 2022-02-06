<template>
  <div>
    <v-divider class="mt-2"></v-divider>
    <v-tabs 
      show-arrows
    >
      <v-tab>
        Profile
      </v-tab>
      <v-tab>
        Memberships
      </v-tab>
      <v-tab>
        Invitations
      </v-tab>
      <v-tab>
        Sessions
      </v-tab>

      <v-tab-item >
        <profile></profile>
      </v-tab-item>

      <v-tab-item >
        <memberships ref="memberships"></memberships>
      </v-tab-item>

      <v-tab-item >
        <invitations @accept="acceptInvitation"></invitations>
      </v-tab-item>

      <v-tab-item >
        <sessions></sessions>
      </v-tab-item>

    </v-tabs>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
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
