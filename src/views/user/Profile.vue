<template>
  <div class="mt-3">
    <v-card tile>
      <v-card-title class="py-2">
        Password
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-3">
        Change your password here.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn 
          small
          @click="openChangePasswordDialog"
          :disabled="$store.get('session/isSuperUser')"
        >
          Change
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card tile class="mt-5">
      <v-card-title class="py-2">
        User info
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-3">
        Update your timezone and username.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn 
          small
          @click="openUpdateUserDialog"
          :disabled="$store.get('session/isSuperUser')"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>

    <update-user-dialog ref="updateUserDialog"></update-user-dialog>
    <change-password-dialog ref="changePasswordDialog"></change-password-dialog>
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
