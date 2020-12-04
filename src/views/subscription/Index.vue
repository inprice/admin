<template>
  <div>
    <div class="title pl-1">
      Subscription
    </div>

    <v-card class="mt-2">
      <v-card-title class="pb-0">
        <v-icon class="mr-4">mdi-text-box-check-outline</v-icon>
        <div class="col pa-0">
          <div>Plan &amp; Billing Info</div>
          <div>
            <div class="caption float-left">Your actual plan and billing info.</div>

            <v-btn-toggle tile class="float-right" :value="selectedTab">
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
          <actual-plan @cancel="cancel" :session="session" />
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
          const loader = this.$loading.show();
          const result = await SubsService.cancel();
          if (result && result.status == true) {
            this.$store.dispatch('auth/cancelSubscription');
            this.refreshActualPlan();
            this.$store.commit('snackbar/setMessage', { text: 'Your subscription has been cancelled.' });
          }
          loader.hide();
        }
      });
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
      this.refreshActualPlan();
    });
  },
  components: {
    ActualPlan: () => import('./ActualPlan'),
    InvoiceInfo: () => import('./InvoiceInfo'),
    Transactions: () => import('./Transactions'),
    confirm: () => import('@/component/Confirm.vue'),
  }
};
</script>
