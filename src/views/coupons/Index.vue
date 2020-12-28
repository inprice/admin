<template>
  <div>
    <div>
      <div class="title">Coupons</div>
      <div class="body-2">Manage your coupons for your account.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-3">
      <v-card-title class="pb-2">
        <v-icon class="mr-4 my-auto">mdi-ticket-confirmation-outline</v-icon>
        <div>
          <div>Coupons</div>
          <div class="caption">A combined list of coupons that assigned, applied and created by you</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn 
          :disabled="$store.get('session/isNotAdmin')"
          v-if="CURSTAT.isActive == false"
          small 
          class="mx-2 my-auto"
          color="success"
          @click="openApplyCouponDialog">
            Apply a coupon
        </v-btn>

        <v-btn 
          :disabled="$store.get('session/isNotAdmin')"
          v-if="CURSTAT.status == 'COUPONED'"
          small
          color="red"
          class="white--text"
          @click="cancel"
        >
          Cancel
        </v-btn>

      </v-card-title>

      <div v-if="coupons.length">
        <v-divider></v-divider>

        <v-simple-table fixed-header>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="10%" class="text-center">Code</th>
                <th width="10%" class="text-center">Days</th>
                <th width="10%" class="text-center">Status</th>
                <th width="15%" class="text-center">Issued At</th>
                <th class="text-center">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cpn in coupons" :key="cpn.id">
                <td class="text-center font-weight-bold">{{ maskCode(cpn) }}</td>
                <td class="text-center font-weight-bold">{{ cpn.days }}</td>
                <td class="text-center">
                  <v-chip small label outlined v-if="cpn.issuedAt">USED</v-chip>
                  <div v-else>
                    <v-chip small label outlined dark v-if="$store.get('session/isAdmin')" color="teal">AVAILABLE</v-chip>
                    <v-chip small label outlined dark v-else color="red">ADMIN NEEDED</v-chip>
                  </div>
                </td>
                <td class="text-center">
                  <ago :date="cpn.issuedAt" v-if="cpn.issuedAt" />
                  <v-btn
                    v-else
                    small
                    color="light-blue"
                    :disabled="loading.apply || $store.get('session/isNotAdmin') || CURSTAT.isActive == true"
                    @click="apply(cpn.code)"
                    style="min-width: 80%"
                    class="white--text">
                    Use
                  </v-btn>
                </td>
                <td class="text-center">{{ cpn.description }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

      </div>

      <block-message 
        v-else 
        :message="'No assigned or used coupon found for this account.'"
      />

    </v-card>

    <apply-coupon ref="applyCouponDialog" @applied="getCoupons" />
    <confirm ref="confirm"></confirm>
    
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import CouponService from '@/service/coupon';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      loading: {
        apply: false,
      },
      coupons: []
    };
  },
  methods: {
    getCoupons() {
      this.loading.refresh = true;
      CouponService.getCoupons()
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
        this.$refs.confirm.open('Coupon', 'is going to be applied right now. Are you sure?', 'This coupon').then(async (confirm) => {
          if (confirm == true) {
            this.applyCoupon(code);
          }
        });
      }
    },
    async applyCoupon(code) {
      this.loading.apply = true;
      const result = await CouponService.applyCoupon(code);
      if (result && result.status == true) {
        this.$store.commit('session/current', result.data.session);
        this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been successfully applied.' });
        this.getCoupons();
      }
      this.loading.apply = false;
    },
    cancel() {
      this.$refs.confirm.open('Cancel Coupon', 'will be cancelled. Are you sure?', 'Your actual coupon use').then(async (confirm) => {
        if (confirm == true) {
          this.loading.apply = true;
          const res = await SubsService.cancel();
          if (res && res.status == true) {
            this.$store.commit('session/current', res.data.session);
            this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been cancelled.' });
          }
          this.loading.apply = false;
        }
      });
    },
    openApplyCouponDialog() {
      this.$refs.applyCouponDialog.open();
    },
    maskCode(coupon) {
      if (!coupon.issuedAt && this.$store.get('session/isNotAdmin')) {
        return coupon.code.substring(0, 2) + '***' + coupon.code.substring(5);
      }
      return coupon.code;
    }
  },
  created() {
    this.$nextTick(() => {
      this.getCoupons();
    });
  },
  components: {
    ApplyCoupon: () => import('./Apply.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>
