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

        <v-list-item link :to="{name: 'products'}">
          <v-list-item-action>
            <v-icon>mdi-package-variant-closed</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Product Definitions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link :to="{name: 'links'}">
          <v-list-item-action>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Links' Statuses</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'import'}">
          <v-list-item-action>
            <v-icon>mdi-import</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Product Import</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item link :to="{name: 'plans'}">
          <v-list-item-action>
            <v-icon>mdi-form-select</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Plans</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'subscription'}">
          <v-list-item-action>
            <v-icon>mdi-credit-card-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscription</v-list-item-title>
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

        <v-list-item @click="openCreateAccount">
          <v-list-item-action>
            <v-icon>mdi-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Create a New Account</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-item :href="`/login?m=addNew`" target="_blank">
          <v-list-item-action>
            <v-icon>mdi-folder-multiple-plus-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login to another</v-list-item-title>
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
      <span v-if="IS_DEV" class="mx-1 yellow--text font-weight-medium">{{ $vuetify.breakpoint.name }}</span>

      <div class="hidden-sm-and-down ml-4 mt-2">
        <img :src="brandNameW" :width="150" />
      </div>

      <v-spacer></v-spacer>

      <v-menu
        offset-y
        v-model="searching"
        v-if="$route.path.indexOf('/products') < 1"
      >
        <template v-slot:activator="{ on, attr }">
          <v-text-field 
            v-on="on" 
            v-bind="attr"
            ref="searchTerm"
            v-model="searchTerm"
            placeholder="Search for products by name"
            append-icon="mdi-close"
            @click:append="clearSearchTerm"
            dense solo light
            hide-details
          />
        </template>

        <v-simple-table>
          <template v-slot:default>
            <tbody v-if="products && products.length">
              <tr v-for="prod in products" :key="prod.id" class="searchTable" @click="openProductPage(prod.id, prod.name)">
                <td class="text-truncate" >{{ prod.name }}</td>
                <td class="text-right">{{ prod.code }}</td>
              </tr>
            </tbody>
            <div v-else style="margin:10px; font-size: 0.875rem;">
              <p v-if="searchTerm && searchTerm.length">
                No product found!
              </p>
              <p v-else>
                Please enter a few chars to search!
              </p>
            </div>
          </template>
        </v-simple-table>
      </v-menu>

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

  </v-app>
</template>

<script>
import ProductService from '@/service/product';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    IS_DEV() {
      return process.env.NODE_ENV == 'development';
    }
  },
  data() {
    return {
      searching: false,
      searchTerm: null,
      products: [],
      drawer: (this.$vuetify.breakpoint.mdAndUp),
      brandNameW: require('@/assets/app/brand-horWR.svg')
    };
  },
  watch: {
    async searchTerm(val) {
      if (!this.searching || this.searching == false) this.searching = true;
      if (!val) {
        this.products = [];
        return;
      }
      const result = await ProductService.search(val);
      if (result) {
        this.products = result;
      } else {
        this.products = [];
      }
    },
  },
  methods: {
    openCreateAccount() {
      this.$refs.accountInfoDialog.edit(null, true);
    },
    clearSearchTerm() {
      this.searchTerm = '';
      this.$refs.searchTerm.focus();
    },
    openProductPage(id, name) {
      this.searchTerm = name;
      if (this.$route.params.id == id) return;
      if (window.location.href.indexOf('/product/') > -1) {
        this.$router.replace({ params: { id } });
      } else {
        this.$router.push({ name: 'product', params: { id } });
      }
    }
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