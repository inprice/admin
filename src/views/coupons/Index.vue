<template>
  <div>
    <div>
      <div class="title">Coupons</div>
      <div class="body-2">Manage your coupons for your account.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-5">
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-ticket-confirmation-outline</v-icon>
            <div class="d-inline">
              <div>The list</div>
              <div class="caption">A combined list of coupons that assigned, applied and created by you</div>
              <div class="caption">
                <strong>Please note:</strong> Available coupons can only be used when you have no active subscription or Free Use!
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn 
              small
              class="ml-2"
              color="success"
              v-if="CURSTAT.isActive == false"
              :disabled="$store.get('session/isNotAdmin')"
              @click="openApplyCouponDialog"
            >
              Apply coupon
            </v-btn>

            <v-btn 
              small
              class="ml-2"
              color="red"
              v-if="CURSTAT.status == 'COUPONED'"
              :disabled="$store.get('session/isNotAdmin')"
              @click="cancel"
            >
              Cancel
            </v-btn>

            <v-btn
              small
              color="white"
              class="my-auto ml-2"
              @click="getCoupons"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="coupons.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.code">Code</th>
                  <th :width="RESPROPS.table.days">Days</th>
                  <th :width="RESPROPS.table.status">Status</th>
                  <th :width="RESPROPS.table.issuedAt">Issued At</th>
                  <th :width="RESPROPS.table.description">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cpn in coupons" :key="cpn.id">
                  <td class="font-weight-bold">{{ maskCode(cpn) }}</td>
                  <td class="font-weight-bold">{{ cpn.days }}</td>
                  <td>
                    <v-chip small label outlined v-if="cpn.issuedAt">USED</v-chip>
                    <div v-else>
                      <v-chip small label outlined dark v-if="$store.get('session/isAdmin')" color="teal">AVAILABLE</v-chip>
                      <v-chip small label outlined dark v-else color="red">ADMIN NEEDED</v-chip>
                    </div>
                  </td>
                  <td>
                    <ago :date="cpn.issuedAt" v-if="cpn.issuedAt" />
                    <v-btn
                      v-else small dark
                      class="my-1"
                      color="light-blue"
                      :disabled="loading.apply || CURSTAT.isActive == true || $store.get('session/isNotAdmin')"
                      @click="apply(cpn.code)"
                      style="min-width: 75%; max-height: 80%"
                    >
                      Use
                    </v-btn>
                  </td>
                  <td>{{ cpn.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <block-message 
        v-else dense
        :message="'No assigned or used coupon in this account.'"
      />

    </v-card>

    <apply-coupon ref="applyCouponDialog" @applied="getCoupons" />
    <confirm ref="confirm"></confirm>

    <overlay :show="overlay" />
    
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import CouponService from '@/service/coupon';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { code: '120px', days: '100px', status: '120px', issuedAt: '150px', description: '350px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { code: '12%', days: '10%', status: '12%', issuedAt: '15%', description: '' },
          };
        }
      }
    },
  },
  data() {
    return {
      overlay: false,
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
        this.$store.commit('session/SET_CURRENT', result.data.session);
        this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been successfully applied.' });
        this.getCoupons();
      }
      this.loading.apply = false;
    },
    cancel() {
      this.$refs.confirm.open('Cancel Coupon', 'will be cancelled. Are you sure?', 'Your actual coupon use').then(async (confirm) => {
        if (confirm == true) {
          this.overlay = true;
          const res = await SubsService.cancel();
          if (res && res.status == true) {
            this.$store.commit('session/SET_CURRENT', res.data.session);
            this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been cancelled.' });
          }
          this.overlay = false;
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
  mounted() {
    this.getCoupons();
  },
  components: {
    ApplyCoupon: () => import('./Apply.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Overlay: () => import('@/component/app/Overlay.vue'),
  }
}
</script>
