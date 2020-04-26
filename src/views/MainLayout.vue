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
        <v-list-item link to="members">
          <v-list-item-action>
            <v-icon>mdi-multiple-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider />

        <div class="px-3 py-2 d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" to="settings">
                <v-icon fab>mdi-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>Account Settings</span>
          </v-tooltip>

          <v-spacer></v-spacer>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon fab>mdi-bell-outline</v-icon>
              </v-btn>
            </template>
            <span>Notifications</span>
          </v-tooltip>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey" clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>inprice</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="mt-2">
        <div class="text-right">
          <div class="subtitle font-weight-bold">{{ session.company }}</div>
          <semi-chip bgColor="white" tagColor="black" dir="rtl" class="caption" :tag="session.role" :value="session.email"></semi-chip>
          <!--span class="caption">{{ session.email }} - {{ session.role }}</span -->
        </div>
      </div>

      <user-menu></user-menu>
    </v-app-bar>

    <v-content>
      <v-responsive class="mx-auto overflow-visible" max-width="1024">
        <v-container>
          <v-fade-transition mode="out-in">
            <router-view></router-view>
          </v-fade-transition>
        </v-container>
      </v-responsive>
    </v-content>

  </v-app>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      drawer: null
    };
  },
  computed: {
    session: get('session/session'),
  },
  components: {
    SemiChip: () => import('@/component/SemiChip.vue'),
    UserMenu: () => import('@/component/app/UserMenu.vue')
  }
};
</script>
