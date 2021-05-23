<template>

  <div v-if="user" class="mt-3">

    <v-card>
      <div class="d-flex justify-space-between px-4 py-2 pt-4">
        <div class="d-flex">
          <v-icon class="mr-4 hidden-xs-only">mdi-account</v-icon>
          <div class="d-inline title">{{ user.email }}</div>
        </div>

        <v-btn 
          small
          text outlined
          class="my-auto"
          @click="$router.go(-1)"
        >
          <v-icon>mdi-arrow-left-thin-circle-outline</v-icon> Go Back
        </v-btn>

      </div>

      <v-divider class="mt-2"></v-divider>

      <v-simple-table class="property-table pt-3 pb-2" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.name" name="Name" :value="user.name" />
            <property :valueClass="RESPROPS.properties.timezone" name="Timezone" :value="user.timezone" />
            <property :valueClass="RESPROPS.properties.bannedAt" name="Banned At" :value="user.bannedAt" v-if="user.banned" />
            <property :valueClass="RESPROPS.properties.banReason" name="Ban Reason" :value="user.banReason" v-if="user.banned" />
            <property :valueClass="RESPROPS.properties.createdAt" name="Created At" :value="user.createdAt" />
            <tr>
              <td colspan="2">
                <v-divider></v-divider>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="text-center">
                <v-btn 
                  small dark
                  class="red"
                  v-if="!user.banned"
                  @click="banUser"
                >
                  <v-icon small>mdi-close-circle</v-icon> <span class="ml-2">Ban This User</span>
                </v-btn>
                <v-btn 
                  small dark
                  class="success"
                  v-else
                  @click="revokeUserBan"
                >
                  <v-icon small>mdi-human-greeting</v-icon> <span class="ml-2">Revoke User's Ban</span>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <membership-list :list="membershipList" @refreshed="refreshMembershipList" />
    <used-list :list="usedServiceList" @deleted="deleteUsedService"  @toggledUnlimitedUse="toggleUnlimitedUsedService" @refreshed="refreshUsedServiceList" />
    <session-list :list="sessionList"  @terminated="terminateSession" @refreshed="refreshSessionList" />

    <ban-user ref="banUserDialog" @banned="refreshUserBanInfo" />
    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SU_UserService from '@/service/super/user';

export default {
  data() {
    return {
      user: null,
      membershipList: [],
      usedServiceList: [],
      sessionList: []
    }
  },
  methods: {
    terminateSession(hash) {
      SU_UserService.terminateSession(hash).then((res) => {
        if (res && res.status) {
          this.sessionList = res.data;
        }
      });
    },
    deleteUsedService(id) {
      SU_UserService.deleteUsedService(id).then((res) => {
        if (res && res.status) {
          this.usedServiceList = res.data;
        }
      });
    },
    toggleUnlimitedUsedService(id) {
      SU_UserService.toggleUnlimitUsedService(id).then((res) => {
        if (res && res.status) {
          this.usedServiceList = res.data;
        }
      });
    },
    refreshUsedServiceList() {
      if (this.user != null) {
        SU_UserService.fetchUsedServices(this.user.id).then((res) => {
          if (res && res.status) {
            this.usedServiceList = res.data;
          }
        });
      }
    },
    refreshMembershipList() {
      if (this.user != null) {
        SU_UserService.fetchMembershipList(this.user.id).then((res) => {
          if (res && res.status) {
            this.membershipList = res.data;
          }
        });
      }
    },
    refreshSessionList() {
      if (this.user != null) {
        SU_UserService.fetchSessionList(this.user.id).then((res) => {
          if (res && res.status) {
            this.sessionList = res.data;
          }
        });
      }
    },
    banUser() {
      this.$refs.banUserDialog.open({ id: this.user.id, email: this.user.email });
    },
    revokeUserBan() {
      this.$refs.confirm.open('Revoke Ban', '\'s ban will be revoked. Are you sure?', this.user.email).then((confirm) => {
        if (confirm == true) {
          SU_UserService.revokeBan(this.user.id)
            .then((res) => {
              if (res && res.status) {
                this.$store.commit('snackbar/setMessage', { text: `${this.user.email}'s ban is successfully revoked` });
                this.refreshUserBanInfo(null);
              }
            });
        }
      });
    },
    refreshUserBanInfo(banReason) {
      if (banReason) {
        this.user.bannedAt = 'JUST NOW';
        this.user.banReason = banReason;
        this.user.banned = true;
      } else {
        this.user.bannedAt = '';
        this.user.banReason = '';
        this.user.banned = false;
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const uid = this.$route.params.uid;
      SU_UserService.fetchUserDetails(uid).then((res) => {
        if (res && res.status) {
          this.user = res.data.user;
          this.membershipList = res.data.membershipList;
          this.usedServiceList = res.data.usedServiceList;
          this.sessionList = res.data.sessionList;
        }
      });
    });
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { name: 'col-10', timezone: 'col-5', banned: 'col-2', bannedAt: 'col-5', banReason: 'col-10', createdAt: 'col-5' },
          };
        }
        default: {
          return {
            properties: { name: 'col-7', timezone: 'col-3', banned: 'col-1', bannedAt: 'col-3', banReason: 'col-7', createdAt: 'col-3' },
          };
        }
      }
    },
  },
  components: {
    BanUser: () => import('../BanUser.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    MembershipList: () => import('./MembershipList'),
    UsedList: () => import('./UsedList'),
    SessionList: () => import('./SessionList'),
    Property: () => import('@/component/app/Property.vue')
  }
};
</script>
