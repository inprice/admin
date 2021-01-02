<template>
  <div class="mt-3">
    <v-card class="pb-2">
      <v-card-title class="pb-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-home-city-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">Profile info of your account.</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          small 
          color="warning"
          @click="openAccountInfoDialog">
            Edit
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-2" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.title" name="Title" :value="CURSTAT.account" />
            <property :valueClass="RESPROPS.properties.format" name="Format" :value="CURSTAT.currencyFormat" />
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <AccountInfoDialog ref="accountInfoDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import AccountService from '@/service/account';

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { title: 'col-11', format: 'col-6' },
          };
        }
        default: {
          return {
            properties: { title: 'col-8', format: 'col-5' },
          };
        }
      }
    },
  },
  methods: {
    async openAccountInfoDialog() {
      const result = await AccountService.get();
      if (result) {
        this.$refs.accountInfoDialog.edit(result, false);
      }
    },
  },
  components: {
    AccountInfoDialog: () => import('./AccountInfo.vue'),
    Property: () => import('@/component/app/Property.vue')
  }
}
</script>

<style scoped>
  .v-list-item {
    padding: 0 6px;
  }
  .v-list,
  .v-list-item__content,
  .v-list-item__content div {
    padding: 0;
  }
</style>