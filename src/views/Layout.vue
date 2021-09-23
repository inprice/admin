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

      <v-list dense nav class="text-uppercase font-weight-light" v-if="$store.get('session/isSuperUser')">

        <v-list-group
          :value="true"
          no-action
          sub-group
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Super User</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link :to="{name: 'sys-dashboard'}">
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-links'}">
            <v-list-item-content>
              <v-list-item-title>Links</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-workspaces'}">
            <v-list-item-content>
              <v-list-item-title>Workspaces</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-users'}">
            <v-list-item-content>
              <v-list-item-title>Users</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-tickets'}">
            <v-list-item-content>
              <v-list-item-title>Tickets</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-announces'}">
            <v-list-item-content>
              <v-list-item-title>Announcements</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link :to="{name: 'sys-platforms'}">
            <v-list-item-content>
              <v-list-item-title>Platforms</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </v-list-group>

      </v-list>

      <v-list dense nav class="text-uppercase font-weight-light" v-if="$store.get('session/hasASession')">

        <v-list-item link :to="{name: 'dashboard'}">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'products'}">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'links'}">
          <v-list-item-action>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>All Links</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'brands'}">
          <v-list-item-action>
            <v-icon>mdi-tag-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Brands</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'categories'}">
          <v-list-item-action>
            <v-icon>mdi-shape-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Categories</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'alarm'}">
          <v-list-item-action>
            <v-icon>mdi-alarm-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Price Alarms</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-chart-box-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Reports</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset v-if="$store.get('session/isAdmin')"></v-divider>

        <v-list-item 
          link 
          :to="{name: 'workspace-settings'}"
          v-if="$store.get('session/isAdmin')" 
        >
          <v-list-item-action>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app clipped-left color="blue-grey" dark>

      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <div class="hidden-sm-and-down ml-4 mt-2">
        <img :src="brandNameW" :width="150" />
      </div>

      <v-spacer v-if="$store.get('session/isNotSuperUser') || CURSTAT.workspaceId"></v-spacer>

      <v-btn 
        icon 
        v-show="$router.history.current.name != 'ticket'"
        @click="$router.push({name: 'ticket'})"
      >
        <v-icon>mdi-chat-question-outline</v-icon>
      </v-btn>

      <notification-menu 
        v-if="CURSTAT.role != 'SUPER'"
        v-show="$router.history.current.name != 'announce'"
      >
      </notification-menu>
      <user-menu></user-menu>

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

    <workspace-info-dialog ref="workspaceInfoDialog" />

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
      search: {
        isLoading: false,
        items: [],
        model: null,
        term: null,
      }
    };
  },
  methods: {
    openCreateWorkspace() {
      this.$refs.workspaceInfoDialog.edit(null, true);
    },
    onScroll(e) {
      if (typeof window === 'undefined') return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 20;
    },
    toTop () {
      this.$vuetify.goTo(0)
    },
    findPageObject(item) {
      let pageTo = { params: { id: item.id } };
      if (item.type == 'G')
        pageTo.name = 'product';
      else
        pageTo.name = 'link';
      return pageTo;
    },
  },
  components: {
    UserMenu: () => import('./UserMenu.vue'),
    NotificationMenu: () => import('./NotificationMenu.vue'),
    WorkspaceInfoDialog: () => import('./workspace/WorkspaceInfo.vue')
  },
};
</script>

<style>
  .v-menu__content, .search-box {
    max-width: 500px !important;
  }
</style>

<style scoped>
  .v-divider--inset {
    margin-left: 2px !important;
    max-width: 100% !important;
  }
</style>