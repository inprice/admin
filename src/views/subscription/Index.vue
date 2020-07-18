<template>
  <div>
    <div class="display-1 mb-5">
      Subscription
    </div>

    <div v-if="session.subsStatus == 'ACTIVE' || session.subsStatus == 'COUPONED'">
      <actual-plan @cancel="cancel" :data="actualPlan" />
      <confirm ref="confirm"></confirm>
    </div>

    <div v-if="session.subsStatus != 'ACTIVE'">
      <plans @buy="buy" :rows="plans" :status="session.subsStatus" />
      <separator text="OR" />
      <coupons @applied="couponApplied" @refresh="fetchCoupons" :coupons="coupons" :status="session.subsStatus" />
    </div>

    <div v-if="session.subsStatus != 'NOT_SET'">
      <transactions :rows="trans" />
    </div>

  </div>
</template>

<script>
import SubsService from '@/service/subscription';

import moment from 'moment';
import Utility from '@/helpers/utility';
import { get } from 'vuex-pathify'

export default {
  computed: {
    plans: get('system/plans'),
    session: get('auth/session'),
  },
  data() {
    return {
      actualPlan: {},
      trans: [],
      coupons: []
    };
  },
  methods: {
    buy(stripePlanId) {
      console.log("Buy is clicked! " + stripePlanId);
    },
    cancel() {
      this.$refs.confirm.open('Cancel Subscription', 'will be cancelled. Are you sure?', 'Your actual subscription').then(async (confirm) => {
        if (confirm == true) {
          const result = await SubsService.cancel();
          if (result && result.status == true) {
            this.$store.dispatch('auth/cancelSubscription');
            this.refreshActualPlan(false);
            Utility.showShortInfoMessage('Status', 'Your subscription has been cancelled.');
          }
        }
      });
    },
    couponApplied(data) {
      this.$store.set('auth/SUBSCRIPTION', data);
      Utility.showShortInfoMessage('Coupon', 'Your coupon has been successfully applied to your account.');
      this.refreshActualPlan();
    },
    refreshActualPlan(refreshCoupons=true) {
      for (const plan of this.plans) {
        if (plan.id == this.session.planId) {
          const renewal = moment(this.session.subsRenewalAt, "YYYY-MM-DD");
          const current = moment().startOf('day');
          const days = moment.duration(renewal.diff(current)).asDays();

          this.actualPlan = {
            name: plan.name, 
            description: 'Up to ' + plan.productLimit + ' products.', 
            status: this.session.subsStatus, 
            renewalTime: `${renewal.format('DD-MM-YYYY')} ( ${days} days ${(days >= 0 ? 'remain' : 'passed')} )`
          };
          break;
        }
      }
      SubsService.getTransactions()
        .then((res) => {
          if (res && res.data) {
            this.trans = res.data.data;
          }
      });
      if (refreshCoupons == true) this.fetchCoupons();
    },
    fetchCoupons() {
      SubsService.getCoupons()
        .then((coupons) => {
          if (coupons) {
            this.coupons = coupons;
          }
      });
    }
  },
  created() {
    Utility.doubleRaf(async () => {
      if (! this.plans || this.plans.length < 1) {
        await this.$store.dispatch('system/fetchPlans');
      }
      this.refreshActualPlan();
    });
  },
  components: {
    Plans: () => import('./Plans'),
    ActualPlan: () => import('./ActualPlan'),
    Coupons: () => import('./Coupons'),
    Transactions: () => import('./Transactions'),
    confirm: () => import('@/component/Confirm.vue'),
    Separator: () => import('@/component/simple/Separator.vue'),
  }
};
</script>
