<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense nav>
        <v-list-item link :to="{name: 'dashboard'}">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group
          no-action
          prepend-icon="mdi-package-variant-closed"
          value="true"
        >
          <template v-slot:activator>
            <v-list-item-title>Product</v-list-item-title>
          </template>

          <v-list-item link :to="{name: 'products'}">
            <v-list-item-content>
              <v-list-item-title>Definitions</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            no-action
            sub-group
            value="true"
          >
            <template v-slot:activator>
              <v-list-item-title>Import</v-list-item-title>
            </template>

            <v-list-item link :to="{name: 'import-csv'}">
              <v-list-item-content>
                <v-list-item-title>Import CSV</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'import-ebay-sku'}">
              <v-list-item-content>
                <v-list-item-title>Ebay's SKU List</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link :to="{name: 'import-amazon-asin'}">
              <v-list-item-content>
                <v-list-item-title>Amazon's ASIN List</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-item link :to="{name: 'companySettings'}">
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
          <v-list-item>
            <v-list-item-action class="mr-2">
              <v-icon right >mdi-copyright</v-icon>
            </v-list-item-action>
            <v-list-item-content class="py-0">
              <v-list-item-title>inprice</v-list-item-title>
              <v-list-item-subtitle>All right reserved</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey" clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div>
        <div class="subtitle font-weight-bold">{{ session.company }}</div>
        <span class="caption">{{ session.email }} - {{ session.role }}</span>
      </div>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            dark icon
            v-on="on"
            @click="openCreateCompany"
          >
            <v-icon>mdi-plus-thick</v-icon>
          </v-btn>
        </template>
        <span>Create a new company</span>
      </v-tooltip>

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
      this.$refs.companyInfoDialog.edit(null, true);
    },
  },
  components: {
    UserMenu: () => import('@/component/app/UserMenu.vue'),
    CompanyInfoDialog: () => import('./company/CompanyInfo.vue')
  }
};
</script>
