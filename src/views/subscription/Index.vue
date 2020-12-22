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

      <invoice-info v-if="CURSTAT.status == 'SUBSCRIBED'"/>

      <block-message v-else>
        <div class="d-flex justify-space-between">
          <span>
            In order to set your invoice header, <span class="font-weight-medium">you need to have an active subscription!</span>
          </span>
          <v-btn 
            small
            color="success"
            class="ml-3 my-auto"
            @click="$router.push( { name: 'plans' })">
              See Plans
          </v-btn>
        </div>
      </block-message>

    </v-card>

    <div v-if="CURSTAT.status != 'CREATED'">
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
    CURSTAT: get('auth/CURRENT_STATUS'),
  },
  data() {
    return {
      allTrans: [],
      invoiceTrans: [],
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
            this.allTrans = res.data.all;
            this.invoiceTrans = res.data.invoice;
          }
      });
    });
  },
  components: {
    InvoiceInfo: () => import('./InvoiceInfo'),
    Transactions: () => import('./Transactions'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>
