<template>
  <div>
    <div>
      <div class="title">{{ user.email }}</div>
      <div class="body-2">User details page for super user.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card>
      <v-simple-table class="property-table pt-3 pb-2" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.name" name="Name" :value="user.name" />
            <property :valueClass="RESPROPS.properties.timezone" name="Timezone" :value="user.timezone" />
            <property :valueClass="RESPROPS.properties.banned" name="Banned?" :value="user.banned ? 'YES' : 'NO'" />
            <property :valueClass="RESPROPS.properties.bannedAt" name="Banned At" :value="user.bannedAt" />
            <property :valueClass="RESPROPS.properties.banReason" name="Reason" :value="user.banReason" />
            <property :valueClass="RESPROPS.properties.createdAt" name="Created At" :value="user.createdAt" />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <membership-list :data="membershipList" />
    <used-list :data="usedList" />
    <session-list :data="sessionList" />
    <access-log-list :data="accessLogList" />

  </div>
</template>

<script>
export default {
  props: ['user', 'accessLogList', 'membershipList', 'usedList', 'sessionList'],
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { name: 'col-10', timezone: 'col-8', banned: 'col-3', bannedAt: 'col-6', banReason: 'col-10', createdAt: 'col-6' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', timezone: 'col-6', banned: 'col-2', bannedAt: 'col-4', banReason: 'col-7', createdAt: 'col-4' },
          };
        }
      }
    },
  },
  components: {
    UsedList: () => import('./UsedList'),
    MembershipList: () => import('./MembershipList'),
    SessionList: () => import('./SessionList'),
    AccessLogList: () => import('./AccessLogList'),
  }
};
</script>
