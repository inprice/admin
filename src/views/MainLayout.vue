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
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Members</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="company-settings">
          <v-list-item-action>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Company Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider />

        <v-list>
          <v-list-item link @click="openCreateCompany">
            <v-list-item-content>
              <v-list-item-title><v-icon left>mdi-plus</v-icon> Create a new Company</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey" clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>inprice</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="mt-2">
        <div class="text-right">
          <div class="subtitle font-weight-bold">{{ session.company }}</div>
          <!-- semi-chip bgColor="white" tagColor="black" dir="rtl" class="caption" :tag="session.role" :value="session.email"></semi-chip -->
          <span class="caption">{{ session.email }} - {{ session.role }}</span>
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

    <CompanyInfoDialog ref="companyInfoDialog"/>

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
  methods: {
    openCreateCompany() {
      this.$refs.companyInfoDialog.insert();
    },
  },
  components: {
    //SemiChip: () => import('@/component/SemiChip.vue'),
    UserMenu: () => import('@/component/app/UserMenu.vue'),
    CompanyInfoDialog: () => import('./company/CompanyInfo.vue')
  }
};
</script>
