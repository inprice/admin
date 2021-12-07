<template>
  <div>
    <v-card tile class="mt-3">
      <v-card-title class="py-2">
        <span>Company Info</span>
        <v-spacer></v-spacer>
        <v-chip 
          label 
          small
          outlined
          class="font-weight-bold"
          :color="info.title ? 'green' : 'blue'"
        >
          {{ info.title ? 'BEEN SET' : 'NOT SET' }}
        </v-chip>
      </v-card-title>
      
      <v-card-text v-if="info.title" class="pt-3">
        <v-card>
          <table class="property-table">
            <tr>
              <th>Company</th>
              <td>{{ info.title }}</td>
            </tr>

            <tr>
              <th>Contact</th>
              <td>{{ info.contactName }}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{{ info.address1 }} {{ info.address2 }}</td>
            </tr>
            <tr>
              <th></th>
              <td>{{ info.postcode ? info.postcode+', ': '' }} {{ info.city ? info.city+' - ' : '' }} {{ info.state ? info.state+' / ' : '' }}  {{ info.country }}</td>
            </tr>
          </table>
        </v-card>
      </v-card-text>

      <v-card-text v-else class="pt-3">
        Before start a subscription, you need to enter your billing info, Company Name, Address etc.
      </v-card-text>

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

    <invoice-info-dialog 
      ref="invoiceInfoDialog" 
      :countries="countries.list"
      @saved="refreshInvoiceInfo"
    />

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
      countries,
      loading: {
        overlay: false,
        tryFreeUse: false,
      },
    };
  },
  methods: {
    openInvoiceInfo() {
      const newInfo = JSON.parse(JSON.stringify(this.info));
      this.$refs.invoiceInfoDialog.open(newInfo);
    },
    refreshInvoiceInfo(form) {
      this.info = form;
    },
  },
  mounted() {
    SubsService.getInfo()
      .then((res) => {
        if (res) {
          this.info = res.data.info;
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
