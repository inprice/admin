<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-home-city-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">You can edit your company profile here using actions buttons placed on the right</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          small 
          color="warning"
          @click="openCompanyInfoDialog">
            Edit
        </v-btn>
       </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pt-3 pb-1">
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="prop-name">Title</td>
              <td><v-text-field solo dense readonly hide-details="true" v-model="session.company" /></td>
            </tr>
            <tr>
              <td class="prop-name">Currency Format</td>
              <td><v-text-field solo dense readonly hide-details="true" class="col-4" v-model="session.currencyFormat" /></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

    </v-card>

    <CompanyInfoDialog ref="companyInfoDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import CompanyService from '@/service/company';

export default {
  computed: {
    session: get('auth/session')
  },
  methods: {
    async openCompanyInfoDialog() {
      const result = await CompanyService.get();
      if (result) {
        this.$refs.companyInfoDialog.edit(result, false);
      }
    },
  },
  components: {
    CompanyInfoDialog: () => import('./CompanyInfo.vue')
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