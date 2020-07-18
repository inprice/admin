<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-ticket-confirmation-outline</v-icon>
        <div>
          <div>Coupons</div>
          <div class="caption">The mixin list of coupons of can be use and have been applied by now</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn
          small
          :loading="loading.refresh" 
          :disabled="loading.refresh"
          @click="$emit('refresh')"
        >
          Refresh
        </v-btn>

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
                <th width="5%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cpn, index) in coupons" :key="cpn.id">
                <td class="text-center font-weight-bold">{{ cpn.code }}</td>
                <td class="text-center">{{ cpn.description }}</td>
                <td class="text-center">{{ cpn.issuedAt | formatDate }}</td>
                <td class="text-center font-weight-bold">{{ cpn.days }}</td>
                <td class="text-center">
                  <v-btn
                    v-if="!cpn.issuedAt && status != 'ACTIVE' && status != 'COUPONED'"
                    small dark
                    color="success"
                    :loading="loading.apply" 
                    :disabled="loading.apply"
                    @click="apply(index, cpn.code)">
                    Use
                  </v-btn>
                  <v-chip small label v-else-if="cpn.issuedAt">USED</v-chip>
                  <v-chip small label dark v-else color="orange">AVAILABLE</v-chip>
                </td>
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

      <v-divider></v-divider>

      <div class="caption pa-4"><strong>Please Note that: </strong> Avaliable coupons can be used when you have no actual plan!</div>

    </v-card>

  </div>
</template>

<script>
import SubsService from '@/service/subscription';

export default {
  props: ['coupons', 'status'],
  data() {
    return {
      loading: {
        apply: false,
        refresh: false,
      }
    };
  },
  methods: {
    async apply(index, code) {
      this.loading.apply = true;
      const result = await SubsService.applyCoupon(code);
      if (result && result.status == true) {
        this.$emit('applied', result.data);
      }
      this.loading.apply = false;
    },
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>