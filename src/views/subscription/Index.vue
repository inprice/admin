<template>
  <div>
    <div>
      <div class="title">Subscription</div>
      <div class="body-2">Your account's subscription info.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-3">
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-format-list-bulleted</v-icon>
            <div class="d-inline">
              <div>Billing Info</div>
              <div class="caption">Your invoice header.</div>
            </div>
          </div>
          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn small @click="refreshSession">
              Refresh Session
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <invoice-info v-if="CURSTAT.status == 'SUBSCRIBED'"/>

      <block-message v-else>
        In order to set your invoice header, you need to have an active subscription!
        <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
          <v-btn 
            :disabled="$store.get('session/isNotAdmin')"
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
    CURSTAT: get('session/getCurrentStatus'),
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
      this.$store.dispatch('session/refresh');
    }
  },
  mounted() {
    SubsService.getTransactions()
      .then((res) => {
        if (res) {
          this.allTrans = res.data.all;
          this.invoiceTrans = res.data.invoice;
        }
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
