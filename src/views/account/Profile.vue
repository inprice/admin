<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-home-city-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">You can edit your account profile here using actions buttons placed on the right</div>
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

      <v-simple-table class="property-table pt-3 pb-1">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Title</td>
              <td><v-text-field solo dense readonly hide-details="true" v-model="CURSTAT.account" /></td>
            </tr>
            <tr>
              <td class="prop-name">Format</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="CURSTAT.currencyFormat" /></td>
            </tr>
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
    CURSTAT: get('auth/CURRENT_STATUS')
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
    AccountInfoDialog: () => import('./AccountInfo.vue')
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