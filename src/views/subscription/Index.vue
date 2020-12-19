<template>
  <div>
    <div class="title pl-1">
      Subscription
    </div>

    <v-card class="mt-2">
      <v-card-title>
        <v-icon class="mr-4">mdi-text-box-check-outline</v-icon>
        <div class="col pa-0 d-flex justify-space-between">
          <div>
            <span>
              Billing Info
            </span>
            <div class="caption">Your invoice header.</div>
          </div>
          <v-btn small class="my-auto" @click="refreshSession">
            Refresh Session
          </v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <invoice-info v-if="CURSTAT.everSubscribed == true"/>
      <block-message v-else>
        In order to set your invoice header, <span class="font-weight-medium">you need to subscribe first!</span>
        <v-btn 
          small
          color="success"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </block-message>

    </v-card>

    <coupons :status="CURSTAT.status" />

    <div v-if="CURSTAT.status != 'CREATED'">
      <transactions :all="allTrans" :invoices="invoiceTrans" />
    </div>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import SubsService from '@/service/subscription';

export default {
  computed: {
    plans: get('system/plans'),
    CURSTAT: get('auth/CURRENT_STATUS'),
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
    InvoiceInfo: () => import('./InvoiceInfo'),
    Transactions: () => import('./Transactions'),
    Coupons: () => import('./Coupons'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>
