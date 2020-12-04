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

        <v-list-item link :to="{name: 'links'}">
          <v-list-item-action>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Links' Statuses</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="{name: 'import'}" v-if="$store.get('auth/IS_EDITOR')">
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
        <v-list-item link :to="{name: 'subscription'}" v-if="$store.get('auth/IS_ADMIN')">
          <v-list-item-action>
            <v-icon>mdi-credit-card-check-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Subscription</v-list-item-title>
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

        <v-list v-if="drawerStatus == 2">
          <v-list-item>
            <v-list-item-content>
              <div class="subtitle font-weight-bold">{{ session.company }}</div>
              <span class="black--text caption">{{ session.email }} - <span class="green--text font-weight-bold">{{ session.role }}</span></span>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <!--v-app-bar app color="blue-grey" dark clipped-left -->
    <v-app-bar app dark clipped-left color="blue-grey">

      <v-app-bar-nav-icon @click.stop="changeDrawerPosition"></v-app-bar-nav-icon>
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
            v-on="on" v-bind="attr"
            class="searchBox"
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
                <td>{{ prod.name }}</td>
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

      <!-- v-responsive class="mx-auto overflow-visible" :style="this.$route.name != 'dashboard' ? 'max-width: 1024px' : ''">
        <v-container :fluid="this.$route.name == 'dashboard'" -->

      <v-responsive class="mx-auto overflow-visible" max-width="1024">
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-responsive>
    </v-main>

    <CompanyInfoDialog ref="companyInfoDialog"/>

  </v-app>
</template>

<script>
import { get } from 'vuex-pathify'
import ProductService from '@/service/product';

export default {
  data() {
    return {
      searching: false,
      searchTerm: null,
      products: [],
      drawerToLeft: true,
      drawerStatus: 2,
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
  computed: {
    session: get('auth/session'),
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
    clearSearchTerm() {
      this.searchTerm = '';
      this.$refs.searchTerm.focus();
    },
    openProductPage(id, name) {
      this.searchTerm = name;
      if (this.$route.params.id == id) return;
      if (window.location.href.indexOf('/product/') > 0) {
        this.$router.replace({ params: { id } });
      } else {
        this.$router.push({ name: 'product', params: { id } });
      }
    }
  },
  components: {
    UserMenu: () => import('@/component/app/UserMenu.vue'),
    CompanyInfoDialog: () => import('./company/CompanyInfo.vue')
  },
};
</script>

<style scoped>
  .v-divider--inset {
    margin-left: 2px !important;
    max-width: 100% !important;
  }

  .searchBox {
    max-width: 500px;
  }

  .searchTable {
    cursor: pointer;
  }
</style>