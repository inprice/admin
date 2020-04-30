<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-home-city-outline</v-icon>
        <div>
          <div>Profile</div>
          <div class="caption">You can edit your company profile here using actions buttons placed on the right</div>
        </div>
       </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-list >

          <v-list-item @click="1">
            <v-list-item-content>
              <div class="col-2 body-2">COMPANY</div>
              <div class="col-8 title">{{ session.company }}</div>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn small @click="openCompanyInfoDialog">Update</v-btn>
            </v-list-item-action>
          </v-list-item>

        </v-list>
      </v-card-text>
    </v-card>

    <CompanyInfoDialog ref="companyInfoDialog"/>
  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import CompanyService from '@/service/company';

export default {
  computed: {
    session: get('session/session')
  },
  methods: {
    async openCompanyInfoDialog() {
      const result = await CompanyService.get();
      if (result) {
        result.companyName = result.name;
        this.$refs.companyInfoDialog.update(result);
      }
    },
  },
  components: {
    CompanyInfoDialog: () => import('./CompanyInfo.vue')
  }
}
</script>

<style scoped>
  .v-list,
  .v-list-item__content,
  .v-list-item__content div {
    padding: 0;
  }
</style>