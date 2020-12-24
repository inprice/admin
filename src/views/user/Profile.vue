<template>
  <div class="mt-3">
    <v-card class="pb-2">
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-account-circle-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">Your profile info</div>
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
            <property valueClass="col-6" name="Name" :value="CURSTAT.user" />
            <property valueClass="col-6" name="Timezone" :value="CURSTAT.timezone" />
            <property valueClass="col-3" name="Role" :value="CURSTAT.role" />
            <property valueClass="col-3" name="Password" value="****" />
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
    CURSTAT: get('session/getCurrentStatus')
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open(this.CURSTAT.email);
    },
    openUpdateUserDialog() {
      this.$refs.updateUserDialog.open({ name: this.CURSTAT.user, timezone: this.CURSTAT.timezone });
    },
  },
  components: {
    UpdateUserDialog: () => import('./components/UpdateUser.vue'),
    ChangePasswordDialog: () => import('./components/ChangePassword.vue'),
    Property: () => import('@/component/app/Property.vue')
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