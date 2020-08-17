<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-circle-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">You can edit your profile info here using actions buttons placed on the right</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          small 
          class="mx-1"
          color="warning"
          @click="openChangePasswordDialog">
            Change Password
        </v-btn>

        <v-btn 
          small 
          class="mx-1"
          color="info"
          @click="openUpdateUserDialog">
            Edit User
        </v-btn>
       </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Name</td>
              <td><v-text-field solo dense readonly hide-details="true" v-model="session.user" /></td>
            </tr>
            <tr>
              <td class="prop-name">Time Zone</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-6" v-model="session.timezone" /></td>
            </tr>
            <tr>
              <td class="prop-name">Password</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-3" :value="'****'" /></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

    </v-card>

    <UpdateUserDialog ref="updateUserDialog"/>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    session: get('auth/session')
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open(this.session.email);
    },
    openUpdateUserDialog() {
      this.$refs.updateUserDialog.open({ name: this.session.user, timezone: this.session.timezone });
    },
  },
  components: {
    UpdateUserDialog: () => import('./components/UpdateUser.vue'),
    ChangePasswordDialog: () => import('./components/ChangePassword.vue')
  }
}
</script>

<style scoped>
  .v-list-item {
    padding: 0 6px;
  }
  .v-list,
  .v-list-item__content,
  .v-list-item__content div {
    padding: 0;
  }

</style>