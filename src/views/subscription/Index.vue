<template>
  <div>
    <div class="title pl-1">
      Subscription
    </div>

    <v-card class="mt-2">
      <v-card-title class="pb-0">
        <v-icon class="mr-4">mdi-text-box-check-outline</v-icon>
        <div class="col pa-0 d-flex justify-space-between">
          <div>
            <span>
              Plan &amp; Billing Info
            </span>
            <div class="caption">Your actual plan and billing info.</div>
          </div>
          <v-btn small class="my-auto" @click="refreshSession">
            Refresh Session
          </v-btn>
        </div>
      </v-card-title>

      <v-btn-toggle tile :value="selectedTab" class="mt-2">
        <v-btn @click="selectedTab=0" small>
          Actual Plan
        </v-btn>
        <v-btn @click="selectedTab=1" small>
          Invoice Header
        </v-btn>
      </v-btn-toggle>

      <v-divider></v-divider>

      <v-tabs v-model="selectedTab">
        <v-tab-item>
          <actual-plan :session="session" />
        </v-tab-item>
        <v-tab-item>
          <invoice-info v-if="session.everSubscribed == true"/>
          <no-data v-else>
            In order to set your invoice header, <span class="font-weight-medium">you need to subscribe first!</span>
            <v-btn 
              small
              color="success"
              class="ml-3 my-auto"
              @click="$router.push( { name: 'plans' })">
                See Plans
            </v-btn>
          </no-data>
        </v-tab-item>
      </v-tabs>

    </v-card>

    <coupons :status="session.companyStatus" />

    <div v-if="session.companyStatus != 'NOT_SET'">
      <transactions :all="allTrans" :invoices="invoiceTrans" />
    </div>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SubsService from '@/service/subscription';
import { get } from 'vuex-pathify'

export default {
  computed: {
    plans: get('system/plans'),
    session: get('auth/session'),
  },
  data() {
    return {
      allTrans: [],
      invoiceTrans: [],
      coupons: [],
      selectedTab: 0
    };
  },
  methods: {
    refreshSession() {
      this.$store.dispatch('auth/refreshSession');
    }
  },
  created() {
    this.$nextTick(async () => {
      SubsService.getTransactions()
        .then((res) => {
          if (res) {
            this.coupons = res.data.coupons;
            this.allTrans = res.data.all;
            this.invoiceTrans = res.data.invoice;
          }
      });
    });
  },
  components: {
    ActualPlan: () => import('./ActualPlan'),
    InvoiceInfo: () => import('./InvoiceInfo'),
    Transactions: () => import('./Transactions'),
    Coupons: () => import('./Coupons'),
    confirm: () => import('@/component/Confirm.vue'),
    NoData: () => import('@/component/simple/NoData.vue'),
  }
};
</script>
