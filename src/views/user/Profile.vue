<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-circle-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">You can edit your profile info here using actions buttons placed on the right</div>
        </div>
       </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list >

          <v-list-item @click="1">
            <v-list-item-content>
              <div class="col-2 body-2">INFO</div>
              <div class="col-8 title">{{ session.user }}</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn small @click="openUpdateUserDialog">Update</v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item @click="1">
            <v-list-item-content>
              <div class="col-2 body-2">PASSWORD</div>
              <div class="col-8 title font-weight-light">****</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn small @click="openChangePasswordDialog">Change</v-btn>
            </v-list-item-action>
          </v-list-item>

        </v-list>
      </v-card-text>
    </v-card>

    <UpdateUserDialog ref="updateUserDialog"/>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    session: get('session/session')
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