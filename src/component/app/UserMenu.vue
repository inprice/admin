<template>
  <div>
    <v-menu
      v-model="menu"
      offset-y
      :nudge-width="300"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card class="text-center" v-if="session">
        <v-icon large class="pt-4">mdi-account-check</v-icon>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="title">{{ session.company }}</v-list-item-title>
            <v-list-item-subtitle>{{ session.email }} - {{ session.role }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <div class="pt-2 pb-5">
          <div class="text-center">
            <v-btn
              text
              small
              outlined
              rounded
              class="mr-1 text-none"
            >
              Account Settings
            </v-btn>
            <v-btn
              text
              small
              outlined
              rounded
              class="ml-1 text-none"
              @click="openChangePasswordDialog"
            >
              Change Password
            </v-btn>
          </div>
        </div>
      </v-card>

      <v-card>
        <v-list subheader>
          <div v-if="sessions && sessions.length > 1">
            <v-subheader>Other Accounts</v-subheader>

            <template v-for="({ user, email, company, role }, i) in sessions">
              <v-list-item
                v-if="email != session.email"
                :key="i"
                :href="`/${i}/app/dashboard`"
                target="_blank"
              >
                <v-icon class="mr-3">mdi-account-arrow-right-outline</v-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ company }}</v-list-item-title>
                  <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                </v-list-item-content>

                <div class="text-right">
                  <v-chip small outlined color="success">
                    {{ role }}
                  </v-chip>
                </div>
              </v-list-item>
            </template>
          </div>

          <v-list-item :href="`/login?m=addNew`" target="_blank">
            <v-icon class="mr-3">mdi-plus</v-icon>
            <v-list-item-content>
              <v-list-item-subtitle>Add another account</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>

      <v-card class="text-center">
        <v-btn
          outlined
          small
          class="my-4 text-none"
          @click="logout"
        >
          Sign out of all accounts
        </v-btn>
        
        <v-divider/>
        
        <div class="py-4">
          <div class="text-center">
            <v-btn text small class="text-none">Privacy Policy</v-btn>
            |
            <v-btn text small class="text-none">Terms of Services</v-btn>
          </div>
        </div>
      </v-card>

    </v-menu>
    <ChangePasswordDialog ref="changePasswordDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import ChangePasswordDialog from '../../views/user/ChangePassword.vue';

export default {
  name: 'UserMenu',
  data() {
    return {
      menu: false
    }
  },
  computed: {
    session: get('session/session'),
    sessions: get('session/sessions'),
  },
  methods: {
    openChangePasswordDialog() {
      this.menu = false;
      this.$refs.changePasswordDialog.open(this.session.email);
    },

    logout() {
      this.$store.dispatch('session/logout', false);
    }
  },
  components: {
    ChangePasswordDialog
  }
}
</script>

<style scoped>
  .v-btn {
    color: #606060;
  }
</style>
