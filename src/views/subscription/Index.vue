<template>
  <div>
    <div>
      <div class="title">Subscription</div>
      <div class="body-2">Your workspace's subscription info.</div>
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
              color="white"
              class="mr-2"
              @click="refreshSession"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh
            </v-btn>
            <v-btn 
              small 
              color="success"
              @click="openInvoiceInfo"
            >
              Edit
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex">
        <v-list dense class="col pa-1">
          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Title</div>
              <div>{{ info.title }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Contact</div>
              <div>{{ info.contactName }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Tax Id</div>
              <div>{{ info.taxId }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Tax Office</div>
              <div>{{ info.taxOffice }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list dense class="col pa-1">
          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Address 1</div>
              <div>{{ info.address1 }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Address 2</div>
              <div>{{ info.address2 }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">City</div>
              <div>{{ info.city }}</div>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item>
            <v-list-item-content>
              <div class="caption blue--text">Country</div>
              <div>{{ info.country }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <invoice-info-dialog ref="invoiceInfoDialog" :countries="countries.list" @saved="invoiceInfoSaved" />

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
    invoiceInfoSaved(newInfo) {
      this.info = newInfo;
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
