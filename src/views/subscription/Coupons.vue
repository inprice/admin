<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-ticket-confirmation-outline</v-icon>
        <div>
          <div>Coupons</div>
          <div class="caption">A combined list of coupons that can be used, and have been applied by now</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          small 
          class="mx-2"
          color="success"
          @click="openApplyCouponDialog">
            Apply a coupon
        </v-btn>

      </v-card-title>

      <div v-if="coupons.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="10%" class="text-center">Code</th>
                <th class="text-center">Description</th>
                <th width="10%" class="text-center">Status</th>
                <th width="15%" class="text-center">Issued At</th>
                <th width="10%" class="text-center">Days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cpn in coupons" :key="cpn.id">
                <td class="text-center font-weight-bold">{{ cpn.code }}</td>
                <td class="text-center">{{ cpn.description }}</td>
                <td class="text-center">
                  <v-chip small label outlined v-if="cpn.issuedAt">USED</v-chip>
                  <v-chip small label outlined dark v-else color="orange">AVAILABLE</v-chip>
                </td>
                <td class="text-center">
                  <ago :date="cpn.issuedAt" v-if="cpn.issuedAt" />
                  <v-btn
                    v-else
                    small
                    color="light-blue lighten-2"
                    :disabled="loading.apply || status == 'ACTIVE' || status == 'COUPONED'"
                    @click="apply(cpn.code)">
                    Use
                  </v-btn>
                </td>
                <td class="text-center font-weight-bold">{{ cpn.days }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <div class="caption pa-4"><strong>Please Note that: </strong> If you have any, available coupons can be used when you have no actual plan!</div>

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

    <apply-coupon ref="applyCouponDialog" @applied="applyCoupon" />
    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SubscriptionService from '@/service/subscription';

export default {
  props: ['status'],
  data() {
    return {
      loading: {
        apply: false,
        refresh: false,
      },
      coupons: []
    };
  },
  methods: {
    getCoupons() {
      this.loading.refresh = true;
      SubscriptionService.getCoupons()
        .then((res) => {
          if (res && res.data) {
            this.coupons = res.data;
          } else {
            this.coupons = [];
          }
          this.loading.refresh = false;
        });
    },
    async apply(code) {
      if (code) {
        this.$refs.confirm.open('Coupon', 'is going to be started right now. Are you sure?', 'Your plan').then(async (confirm) => {
          if (confirm == true) {
            this.loading.apply = true;
            const result = await SubscriptionService.applyCoupon(code);
            if (result && result.status == true) {
              this.applyCoupon(result.data);
            }
            this.loading.apply = false;
          }
        });
      }
    },
    async applyCoupon(/* data */) {
      this.getCoupons();
      this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been successfully applied.' });
    },
    openApplyCouponDialog() {
      this.$refs.applyCouponDialog.open();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getCoupons();
    });
  },
  components: {
    ApplyCoupon: () => import('@/component/app/ApplyCoupon.vue'),
    confirm: () => import('@/component/Confirm.vue'),
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>