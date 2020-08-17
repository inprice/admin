<template>
  <v-app>
    <v-navigation-drawer 
      app clipped
      v-model="drawerStatus" 
      :mini-variant="drawerStatus == 1" 
      :expand-on-hover="drawerStatus == 1">
      <v-list dense nav class="text-uppercase font-weight-light">
        <v-list-item link :to="{name: 'dashboard'}">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'products'}">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Product Definitions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'competitors'}">
          <v-list-item-action>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Competitors' Statuses</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'import-csv'}" v-if="$store.get('auth/IS_EDITOR')">
          <v-list-item-action>
            <v-icon>mdi-file-delimited-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>CSV File</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'import-url'}" v-if="$store.get('auth/IS_EDITOR')">
          <v-list-item-action>
            <v-icon>mdi-playlist-minus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>URL List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'import-ebay-sku'}" v-if="$store.get('auth/IS_EDITOR')">
          <v-list-item-action>
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ebay's SKU List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'import-amazon-asin'}" v-if="$store.get('auth/IS_EDITOR')">
          <v-list-item-action>
            <v-icon>mdi-amazon</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Amazon's ASIN List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!-- v-list-item link :to="{name: 'imported-prods'}">
          <v-list-item-action>
            <v-icon>mdi-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Imported Products</v-list-item-title>
          </v-list-item-content>
        </v-list-item -->

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'subscription'}" v-if="$store.get('auth/IS_ADMIN')">
          <v-list-item-action>
            <v-icon>mdi-credit-card-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscription</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'company-settings'}" v-if="$store.get('auth/IS_ADMIN')">
          <v-list-item-action>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Company Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item @click="openCreateCompany">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Create a New Company</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <template v-slot:append>
        <v-divider />

        <v-list>
          <v-list-item>
            <v-list-item-action class="mr-2">
              <v-icon right class="ml-0">mdi-copyright</v-icon>
            </v-list-item-action>
            <v-list-item-content class="py-0">
              <v-list-item-title>inprice</v-list-item-title>
              <v-list-item-subtitle>All right reserved - 2020</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app color="blue-grey" dark clipped-left class="pl-0">
      <v-app-bar-nav-icon @click.stop="changeDrawerPosition"></v-app-bar-nav-icon>

      <div>
        <div class="subtitle font-weight-bold">{{ session.company }}</div>
        <span class="caption">{{ session.email }} - {{ session.role }}</span>
      </div>

      <v-spacer></v-spacer>

      <user-menu></user-menu>
    </v-app-bar>

    <v-content>

      <!-- v-responsive class="mx-auto overflow-visible" :style="this.$route.name != 'dashboard' ? 'max-width: 1024px' : ''">
        <v-container :fluid="this.$route.name == 'dashboard'" -->

      <v-responsive class="mx-auto overflow-visible" max-width="1024">
        <v-container>
          <router-view></router-view>
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
      drawerToLeft: true,
      drawerStatus: 2
    };
  },
  computed: {
    session: get('auth/session')
  },
  methods: {
    changeDrawerPosition() {
      if (this.drawerToLeft) {
        if (this.drawerStatus == 0) {
          this.drawerToLeft = false;
          this.drawerStatus = 1;
        } else {
          this.drawerStatus--;
        }
      } else {
        if (this.drawerStatus == 2) {
          this.drawerToLeft = true;
          this.drawerStatus = 1;
        } else {
          this.drawerStatus++;
        }
      }
    },
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

<style scoped>
  .v-divider--inset {
    margin-left: 2px !important;
    max-width: 100% !important;
  }
</style>