<template>
  <div>

    <div class="title my-3">Your status</div>
    <block-message 
      class="mb-0"
      v-if="CURSTAT.isFree && $store.get('session/isAdmin')">
      Your actual status is {{ CURSTAT.status }}. It's ending {{ prettyRemainingDaysForFree() }}
      You can subscribe to any plan below
      <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
        <v-btn 
          small
          color="error"
          class="my-auto"
          @click="cancel()"
          :disabled="$store.get('session/isNotAdmin')"
        >
          Or Cancel
        </v-btn>
      </div>
    </block-message>

    <v-card v-if="CURSTAT.status == 'CREATED'" class="mt-3">
      <v-card-title class="pb-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-arrow-right-thin-circle-outline</v-icon>
        <div>Free use</div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-4" style="background-color: lightyellow">
        You have a <b>Free-Use</b> right! You are highly advised to start with a <b>14-day free</b> trial period.
        <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
          <v-btn
            small 
            color="success"
            class="my-auto ml-3"
            :loading="loading.tryFreeUse" 
            :disabled="loading.tryFreeUse || $store.get('session/isNotAdmin')"
            @click="startFreeUse"
          >
            Let me try
          </v-btn>
        </div>
      </div>
    </v-card>

    <block-message
      class="mb-0" 
      v-if="CURSTAT.isActive == false && CURSTAT.status != 'CREATED'"
    >
      This workspace has been {{ CURSTAT.status.toLowerCase() }}
      <ago class="d-inline" :date="CURSTAT.lastStatusUpdate" />
    </block-message>

    <v-card tile class="mt-5">
      <v-card-title class="py-2">
        <span>Company Details</span>
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
    async startFreeUse() {
      this.$refs.confirm.open('Free Use', 'is going to be started now. Are you sure?', 'Your 14 days free Basic Plan').then(async (confirm) => {
        if (confirm == true) {
          this.loading.tryFreeUse = true;
          const result = await SubsService.startFreeUse();
          if (result.status == true) {
            this.$store.commit('session/SET_CURRENT', result.data.session);
          } else {
            this.$store.dispatch('session/refresh');
          }
          this.loading.tryFreeUse = false;
        }
      });
    },
    cancel() {
      this.$refs.confirm.open('Cancel Subscription', 'will be cancelled. Are you sure?', 
        'Your actual subscription').then(async (confirm) => {
        if (confirm == true) {
          this.loading.overlay = true;
          const res = await SubsService.cancel();
          if (res && res.status == true) {
            this.$store.commit('session/SET_CURRENT', res.data.session);
            this.$store.commit('snackbar/setMessage', { text: 'Your subscription has been cancelled.' });
          }
          this.loading.overlay = false;
        }
      });
    },
    openInvoiceInfo() {
      const newInfo = JSON.parse(JSON.stringify(this.info));
      this.$refs.invoiceInfoDialog.open(newInfo);
  },
    refreshInvoiceInfo(form) {
      this.info = form;
    },
    prettyRemainingDaysForFree() {
      let res;
      if (this.CURSTAT.daysToRenewal == 0) 
        res = 'TODAY!';
      else if (this.CURSTAT.daysToRenewal == 1) 
        res = 'TOMORROW!';
      else
        res = 'in ' + this.CURSTAT.daysToRenewal + ' DAYS!';
      return res;
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
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>
