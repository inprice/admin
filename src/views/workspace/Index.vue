<template>
  <div>
    <v-divider class="mt-2"></v-divider>
    <v-tabs 
      show-arrows
    >
      <v-tab>
        Subscription
      </v-tab>
      <v-tab>
        Plans
      </v-tab>
      <v-tab>
        Workspace
      </v-tab>
      <v-tab>
        Team
      </v-tab>
      <v-tab>
        Voucher
      </v-tab>

      <v-tab-item >
        <billing-info></billing-info>
      </v-tab-item>

      <v-tab-item >
        <plans></plans>
      </v-tab-item>

      <v-tab-item>
        <edit-workspace></edit-workspace>
        <delete-workspace></delete-workspace>
      </v-tab-item>

      <v-tab-item >
        <users></users>
      </v-tab-item>

      <v-tab-item >
        <vouchers></vouchers>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  components: {
    Users: () => import('./members/Index.vue'),
    Vouchers: () => import('./vouchers/Index.vue'),
    BillingInfo: () => import('./invoice/Index.vue'),
    Plans: () => import('./Plans.vue'),
    EditWorkspace: () => import('./Edit.vue'),
    DeleteWorkspace: () => import('./Delete.vue'),
  }
};
</script>

<style scoped>
  .v-tab--active {
    background-color: #dadada;
  }
</style>
