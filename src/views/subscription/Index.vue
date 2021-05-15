<template>
  <div>
    <div>
      <div class="title">Subscription</div>
      <div class="body-2">Your account's subscription info.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-3">
      <v-card-title class="d-block pb-2">
        <div class="d-flex justify-space-between">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-format-list-bulleted</v-icon>
            <div class="d-inline">
              <div>Billing Info</div>
              <div class="caption">Your invoice header.</div>
            </div>
          </div>

          <div class="my-auto">
            <v-btn
              small
              text outlined
              class="mr-2"
              @click="refreshSession"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh Session
            </v-btn>
            <v-btn 
              small 
              text outlined
              color="success"
              @click="openInvoiceInfo"
            >
              Edit
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="property-table pa-3" dense>
        <template v-slot:default>
          <tbody>
            <property :valueClass="RESPROPS.properties.title" name="Title" :value="info.title" />
            <property :valueClass="RESPROPS.properties.title" name="Address1" :value="info.address1" />
            <property :valueClass="RESPROPS.properties.title" name="2" :value="info.address2" />
            <property :valueClass="RESPROPS.properties.postcode" name="Postcode" :value="info.postcode" />
            <property :valueClass="RESPROPS.properties.city" name="City" :value="info.city" />
            <property :valueClass="RESPROPS.properties.state" name="State" :value="info.state" />
            <property :valueClass="RESPROPS.properties.country" name="Country" :value="info.countryName" />
          </tbody>
        </template>
      </v-simple-table>

      <invoice-info-dialog ref="invoiceInfoDialog" :list="countries.list" @saved="invoiceInfoSaved" />

    </v-card>

    <div v-if="CURSTAT.status != 'CREATED'" class="mt-5">
      <transactions :all="transactions" :invoices="invoices" />
    </div>

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
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            properties: { title: 'col-10', postcode: 'col-6', city: 'col-9', state: 'col-9', country: 'col-9' },
          };
        }
        case 'sm': {
          return {
            properties: { title: 'col-10', postcode: 'col-3', city: 'col-5', state: 'col-5', country: 'col-5' },
          };
        }
        default: {
          return {
            properties: { title: 'col-9', postcode: 'col-2', city: 'col-3', state: 'col-3', country: 'col-3' },
          };
        }
      }
    },
  },
  data() {
    return {
      info: {},
      transactions: [],
      invoices: [],
      selectedTab: 0,
      countries
    };
  },
  methods: {
    openInvoiceInfo() {
      const newInfo = JSON.parse(JSON.stringify(this.info));
      this.$refs.invoiceInfoDialog.open(newInfo);
    },
    invoiceInfoSaved(newInfo) {
      this.info = newInfo;
      this.info.countryName = countries.findByCode(newInfo.country);
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
          if (this.info) {
            this.info.countryName = countries.findByCode(this.info.country);
          }
        }
    });
  },
  components: {
    Transactions: () => import('./Transactions'),
    Confirm: () => import('@/component/Confirm.vue'),
    InvoiceInfoDialog: () => import('./InvoiceInfoEdit.vue'),
    Property: () => import('@/component/app/Property.vue')
  }
};
</script>
