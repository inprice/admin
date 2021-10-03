<template>
  <div>
    <v-card tile class="mt-3">
      <v-card-title class="py-2">
        <span>Billing info</span>
        <v-spacer></v-spacer>
        <v-chip 
          label 
          small
          outlined
          class="font-weight-bold"
          :color="info.title ? 'cyan' : 'orange'"
        >
          {{ info.title ? 'SET' : 'NOT SET' }}
        </v-chip>
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="pt-3">
        Before start a subscription, you need to enter your billing info, Company Name, Address etc.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn
          small
          :disabled="$store.get('session/isNotAdmin')"
          @click="openInvoiceInfo"
        >
          Edit
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-if="CURSTAT.status != 'CREATED'" class="mt-5">
      <transactions :all="transactions" :invoices="invoices" />
    </div>

    <invoice-info-dialog ref="invoiceInfoDialog" :countries="countries.list"></invoice-info-dialog>
    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import SubsService from '@/service/subscription';
import countries from '@/data/countries';
import { get } from 'vuex-pathify'

export default {
  computed: {
    plans: get('system/plans'),
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      info: {},
      transactions: [],
      invoices: [],
      countries
    };
  },
  methods: {
    openInvoiceInfo() {
      const newInfo = JSON.parse(JSON.stringify(this.info));
      this.$refs.invoiceInfoDialog.open(newInfo);
    },
    refreshSession() {
      this.$store.dispatch('session/refresh');
    }
  },
  mounted() {
    SubsService.getInfo()
      .then((res) => {
        if (res) {
          this.info = res.data.info;
          this.transactions = res.data.transactions;
          this.invoices = res.data.invoices;
        }
    });
  },
  components: {
    Transactions: () => import('./Transactions'),
    Confirm: () => import('@/component/Confirm.vue'),
    InvoiceInfoDialog: () => import('./InvoiceInfoEdit.vue'),
  }
};
</script>
