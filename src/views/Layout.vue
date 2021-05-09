<template>
  <v-app>
    <v-navigation-drawer 
      app clipped 
      v-model="drawer"
      :temporary="$vuetify.breakpoint.smAndDown">

      <template v-slot:prepend>
        <v-list dense v-if="$vuetify.breakpoint.xsOnly" class="pa-0">
          <v-list-item class="pa-0 ma-0 hidden-md-and-up" @click.stop="drawer = !drawer">
            <v-btn
              icon
              class="mx-auto">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
        <v-divider v-if="$vuetify.breakpoint.xsOnly"></v-divider>
      </template>

      <v-list dense nav class="text-uppercase font-weight-light">

        <v-list-item link :to="{name: 'dashboard'}">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'groups'}">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Groups</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'links'}">
          <v-list-item-action>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Links</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'tickets'}">
          <v-list-item-action>
            <v-icon>mdi-forum</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Tickets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'coupons'}">
          <v-list-item-action>
            <v-icon>mdi-ticket-confirmation-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Coupons</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-bell-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Notifications</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'subscription'}">
          <v-list-item-action>
            <v-icon>mdi-credit-card-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscription</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'plans'}">
          <v-list-item-action>
            <v-icon>mdi-form-select</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Plans</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'user-settings'}">
          <v-list-item-action>
            <v-icon>mdi-account-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>User Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'account-settings'}" :disabled="$store.get('session/isNotAdmin')">
          <v-list-item-action>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Account Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item @click="openCreateAccount">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Create a New Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="$store.dispatch('session/logout', false)">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <template v-slot:append>
        <v-divider />

        <v-list v-if="CURSTAT" class="pa-0">
          <v-list-item class="text-center black--text text-truncate">
            <v-list-item-content>
              <div class="subtitle font-weight-bold">{{ CURSTAT.account }}</div>
              <span class="caption">{{ CURSTAT.email }}</span>
              <v-chip label outlined class="caption d-flex justify-center">
                <span class="font-weight-medium">{{ CURSTAT.role }}</span>
                <span class="mx-2">|</span>
                <span class="font-weight-medium green--text text-uppercase darken-2">{{ CURSTAT.isActive ? CURSTAT.planName : CURSTAT.status }}</span>
              </v-chip>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>

    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue-grey"  dark>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <div class="hidden-sm-and-down ml-4 mt-2">
        <img :src="brandNameW" :width="150" />
      </div>

      <v-spacer></v-spacer>

      <user-menu />

    </v-app-bar>

    <v-main>
      <v-responsive class="mx-auto overflow-visible" max-width="1024">
        <v-container>
          <vue-page-transition name="fade">
            <router-view></router-view>
          </vue-page-transition>
        </v-container>
      </v-responsive>
    </v-main>

    <AccountInfoDialog ref="accountInfoDialog"/>

    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab dark
      fixed bottom right
      color="primary"
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>

  </v-app>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      brandNameW: require('@/assets/app/brand-horWR.svg'),
      drawer: (this.$vuetify.breakpoint.mdAndUp),
      fab: false,
    };
  },
  methods: {
    openCreateAccount() {
      this.$refs.accountInfoDialog.edit(null, true);
    },
    onScroll(e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
  },
  components: {
    UserMenu: () => import('@/component/app/UserMenu.vue'),
    AccountInfoDialog: () => import('./account/AccountInfo.vue')
  },
};
</script>

<style scoped>
  .v-divider--inset {
    margin-left: 2px !important;
    max-width: 100% !important;
  }
  .searchTable {
    cursor: pointer;
  }
</style>