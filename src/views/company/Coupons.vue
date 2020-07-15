<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-ticket-confirmation-outline</v-icon>
        <div>
          <div>Coupons</div>
          <div class="caption">The list of coupons you have applied by now</div>
        </div>
      </v-card-title>

      <div v-if="coupons.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="10%" class="text-center">Code</th>
                <th class="text-center">Description</th>
                <th width="15%" class="text-center">Issued At</th>
                <th width="10%" class="text-center">Days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cpn in coupons" :key="cpn.id">
                <td class="text-center font-weight-bold">{{ cpn.code }}</td>
                <td class="text-center">{{ cpn.description }}</td>
                <td class="text-center">{{ cpn.issuedAt | formatDate }}</td>
                <td class="text-center font-weight-bold">{{ cpn.days }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

      </div>
      <div v-else>
        <v-divider></v-divider>
        <v-card-text>
          <p>
            You have no coupon right now.
          </p>
        </v-card-text>
      </div>

    </v-card>

  </div>
</template>

<script>
import CompanyService from '@/service/company';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      loading: {
        refresh: false,
      },
      coupons: []
    };
  },
  methods: {
    async getCoupons() {
      this.loading.refresh = true;
      const result = await CompanyService.getCoupons();
      if (result) {
        this.coupons = result;
      } else {
        this.coupons = [];
      }
      this.loading.refresh = false;
    },
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.getCoupons();
    });
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>