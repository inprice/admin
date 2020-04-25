<template>
  <div>
    <v-card>
      <v-card-title> <v-icon class="mr-4">mdi-account-circle-outline</v-icon> Profile</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list >
          <v-list-item key="0" @click="1==1">

            <v-list-item-content>
              <div class="col-2 caption">NAME</div>
              <div class="col-8 title font-weight-light" v-if="session">{{ session.user }}</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                small
                :loading="loading" 
                :disabled="loading"
                @click="openUpdateUserNameDialog"
              >
                Update
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-list-item key="1" @click="1==1">
            <v-list-item-content>
              <div class="col-2 caption">PASSWORD</div>
              <div class="col-8 title font-weight-light">****</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                small
                :loading="loading" 
                :disabled="loading"
                @click="openChangePasswordDialog"
              >
                Change
              </v-btn>
            </v-list-item-action>
          </v-list-item>

        </v-list>
      </v-card-text>

    </v-card>

    <UpdateUserNameDialog ref="updateUserNameDialog"/>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import UserService from '@/service/user';

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    session: get('session/session')
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open(this.session.email);
    },
    openUpdateUserNameDialog() {
      this.$refs.updateUserNameDialog.open(this.session.user);
    },
    async getOpenedSessions() {
      const result = await UserService.getOpenedSessions();
      if (result) {
        this.sessions = result;
      } else {
        this.sessions = [];
      }
    },
    async closeAllSessions() {
      this.loading = true;
      const result = await UserService.closeAllSessions();
      if (result == true) {
        this.$store.dispatch('session/logout', false);
        return;
      }
      this.loading = false;
    }
  },
  components: {
    UpdateUserNameDialog: () => import('../../user/UpdateUserName.vue'),
    ChangePasswordDialog: () => import('../../user/ChangePassword.vue')
  }
}
</script>

<style scoped>
  .v-list,
  .v-list-item__content,
  .v-list-item__content div {
    padding: 0;
  }
</style>