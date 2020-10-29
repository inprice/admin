<template>
  <div>
    <div class="display-1 mb-5">
      Subscription
    </div>

    <v-card class="py-2">
      <v-card-title class="pb-0">
        <v-icon class="mr-4">mdi-text-box-check-outline</v-icon>
        <div class="col pa-0">
          <div>Plan &amp; Billing Info</div>
          <div>
            <div class="caption float-left">Your actual plan and billing info.</div>

            <v-btn-toggle tile v-model="selectedTab" class="float-right">
              <v-btn @click="selectedTab=0" small>
                Actual Plan
              </v-btn>

              <v-btn @click="selectedTab=1" small>
                Invoice Header
              </v-btn>
            </v-btn-toggle>
          </div>

        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-tabs v-model="selectedTab">
        <v-tab-item>
          <actual-plan @cancel="cancel" :data="actualPlan" :status="session.subsStatus" @applied="couponApplied" />
        </v-tab-item>
        <v-tab-item>
          <invoice-info />
        </v-tab-item>
      </v-tabs>

    </v-card>

    <confirm ref="confirm"></confirm>

    <div v-if="session.subsStatus != 'ACTIVE'">
      <plans :rows="plans" :status="session.subsStatus" />
    </div>

    <div v-if="session.subsStatus != 'NOT_SET'">
      <transactions :all="allTrans" :invoices="invoiceTrans" />
    </div>

  </div>
</template>

<script>
import SubsService from '@/service/subscription';

import moment from 'moment';
import { get } from 'vuex-pathify'

export default {
  computed: {
    plans: get('system/plans'),
    session: get('auth/session'),
  },
  data() {
    return {
      actualPlan: {},
      allTrans: [],
      invoiceTrans: [],
      selectedTab: 0
    };
  },
  methods: {
    cancel() {
      this.$refs.confirm.open('Cancel Subscription', 'will be cancelled. Are you sure?', 'Your actual subscription').then(async (confirm) => {
        if (confirm == true) {
          const result = await SubsService.cancel();
          if (result && result.status == true) {
            this.$store.dispatch('auth/cancelSubscription');
            this.refreshActualPlan();
            this.$store.commit('snackbar/setMessage', { text: 'Your subscription has been cancelled.' });
          }
        }
      });
    },
    couponApplied(/* data */) {
      this.$store.commit('snackbar/setMessage', { text: 'Your coupon has been successfully applied to your account.' });
      this.refreshActualPlan();
    },
    refreshActualPlan() {
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
          if (res) {
            this.allTrans = res.data.all;
            this.invoiceTrans = res.data.invoice;
          }
      });
    },
  },
  created() {
    this.$nextTick(async () => {
      if (! this.plans || this.plans.length < 1) {
        await this.$store.dispatch('system/fetchPlans');
      }
      this.refreshActualPlan();
    });
  },
  components: {
    Plans: () => import('./Plans'),
    ActualPlan: () => import('./ActualPlan'),
    InvoiceInfo: () => import('./InvoiceInfo'),
    Transactions: () => import('./Transactions'),
    confirm: () => import('@/component/Confirm.vue'),
  }
};
</script>
