<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-circle-outline</v-icon>
            <div class="d-inline">
              <div>Profile</div>
              <div class="caption">Your profile info</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              color="warning"
              class="mx-2"
              @click="openChangePasswordDialog"
              :disabled="$store.get('session/isSuperUser')"
            >
              Change Password
            </v-btn>

            <v-btn
              small
              class="mx-2"
              @click="openUpdateUserDialog"
              :disabled="$store.get('session/isSuperUser')"
            >
              Edit User
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex">
        <v-list dense class="col pa-1">
          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Username</div>
              <div>{{ CURSTAT.user }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Password</div>
              <div>****</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list dense class="col pa-1">
          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Role</div>
              <div>{{ CURSTAT.role }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Timezone</div>
              <div>{{ CURSTAT.timezone }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-card>

    <UpdateUserDialog ref="updateUserDialog"/>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open(this.CURSTAT.email);
    },
    openUpdateUserDialog() {
      this.$refs.updateUserDialog.open({ name: this.CURSTAT.user, email: this.CURSTAT.email, timezone: this.CURSTAT.timezone });
    },
  },
  components: {
    UpdateUserDialog: () => import('./components/UpdateUser.vue'),
    ChangePasswordDialog: () => import('./components/ChangePassword.vue'),
  }
}
</script>
