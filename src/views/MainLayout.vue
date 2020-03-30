<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link to="dashboard">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="products">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey" clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>inprice</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-menu
        offset-y
        bottom
        origin="right top"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list align="right">
          <v-list-item @click="openChangePasswordDialog">
            <v-list-item-title>Change Password</v-list-item-title>
            <v-icon class="pl-2">mdi-textbox-password</v-icon>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
            <v-icon class="pl-2">mdi-logout</v-icon>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <v-content>
      <v-responsive class="mx-auto overflow-visible" max-width="1024">
        <v-container>
          <v-fade-transition mode="out-in">
            <router-view></router-view>
          </v-fade-transition>
          
          <ChangePasswordDialog ref="changePasswordDialog"/>
        </v-container>
      </v-responsive>
    </v-content>

    <!-- <v-content>
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>

        <ChangePasswordDialog ref="changePasswordDialog"/>
      </v-container>
    </v-content> -->

    <v-footer app dark color="blue-grey">
      <span>inprice &copy; 2020</span>
      <v-spacer></v-spacer>
      <v-chip
        small
        label
        color="cyan"
        text-color="white"
        outlined
      >
        <v-avatar left>
          <v-icon>mdi-account-circle</v-icon>
        </v-avatar>
        {{ userEmail }} - {{ userRole }}
      </v-chip>
    </v-footer>
  </v-app>
</template>

<script>
import AuthService from '@/service/auth-service';
import SessionService from '../service/session-service';

import ChangePasswordDialog from './user/ChangePassword.vue';

export default {
  data() {
    return {
      userEmail: '',
      userRole: '',
      drawer: null
    };
  },
  methods: {
    openChangePasswordDialog() {
      this.$refs.changePasswordDialog.open();
    },
    logout() {
      AuthService.logout(false);
    }
  },
  created() {
    this.userEmail = SessionService.getUserEmail();
    this.userRole = SessionService.getUserRole();
    this.$vuetify.theme.dark = false;
  },
  components: {
    ChangePasswordDialog
  }
};
</script>
