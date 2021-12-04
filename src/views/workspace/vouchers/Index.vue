<template>
  <div>
    <v-card class="mt-3">
      <v-card-title class="py-2">
        Vouchers
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="py-3">
        <div class="font-weight-bold">Please keep in mind;</div>
        <ul class="py-2">
          <li>You can use only those vouchers <strong>assigned</strong> to your workspace.</li>
          <li>Vouchers can be used when you have <strong>no active subscription</strong>.</li>
          <li>Cancelled vouchers will never be used again.</li>
        </ul>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn 
          small
          color="error"
          class="mr-2"
          :disabled="CURSTAT.status != 'VOUCHERED'"
          @click="cancel"
        >
          Remove
        </v-btn>

        <v-btn 
          small
          color="success"
          class="ml-2"
          :disabled="CURSTAT.isActive"
          @click="openAddVoucherDialog"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="mt-5 mb-2 title">Assigned vouchers</div>

    <v-card v-if="vouchers.length">
      <table class="pb-2 info-table">
        <thead>
          <tr>
            <th class="text-center" width="10%">Code</th>
            <th class="text-right" width="10%">Days</th>
            <th class="text-center" width="15%">Status</th>
            <th class="text-center" width="15%">Issued At</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cpn in vouchers" :key="cpn.id">
            <td class="font-weight-bold">{{ maskCode(cpn) }}</td>
            <td class="text-right font-weight-bold">{{ cpn.days }}</td>
            <td class="text-center">
              <v-chip small label outlined v-if="cpn.issuedAt">USED</v-chip>
              <div v-else>
                <v-chip small label outlined dark v-if="$store.get('session/isAdmin')" color="teal">AVAILABLE</v-chip>
                <v-chip small label outlined dark v-else color="red">ADMIN NEEDED</v-chip>
              </div>
            </td>
            <td class="text-center">
              <ago :date="cpn.issuedAt" v-if="cpn.issuedAt" />
              <v-btn
                v-else small dark
                class="my-1"
                color="light-blue"
                :disabled="loading.add || CURSTAT.isActive == true || $store.get('session/isNotAdmin')"
                @click="add(cpn.code)"
                style="min-width: 75%; max-height: 80%"
              >
                Use
              </v-btn>
            </td>
            <td>{{ cpn.description }}</td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <block-message 
      v-else dense
      class="mt-2"
      :message="'No assigned or used voucher found.'"
    />

    <add-voucher ref="addVoucherDialog" @applied="getVouchers" />
    <confirm ref="confirm"></confirm>

    <overlay :show="overlay" />
    
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import VoucherService from '@/service/voucher';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      overlay: false,
      loading: {
        add: false,
      },
      vouchers: []
    };
  },
  methods: {
    getVouchers() {
      this.loading.refresh = true;
      VoucherService.getVouchers()
        .then((res) => {
          if (res && res.data) {
            this.vouchers = res.data;
          } else {
            this.vouchers = [];
          }
          this.loading.refresh = false;
        });
    },
    async add(code) {
      if (code) {
        this.$refs.confirm.open('Voucher', 'is going to be applied right now. Are you sure?', 'This voucher').then(async (confirm) => {
          if (confirm == true) {
            this.addVoucher(code);
          }
        });
      }
    },
    async addVoucher(code) {
      this.loading.add = true;
      const result = await VoucherService.addVoucher(code);
      if (result && result.status == true) {
        this.$store.commit('session/SET_CURRENT', result.data.session);
        this.$store.commit('snackbar/setMessage', { text: 'Your voucher has been successfully applied.' });
        this.getVouchers();
      }
      this.loading.add = false;
    },
    cancel() {
      this.$refs.confirm.open('Cancel Voucher', 'will be cancelled. Are you sure?', 'Your actual voucher use').then(async (confirm) => {
        if (confirm == true) {
          this.overlay = true;
          const res = await SubsService.cancel();
          if (res && res.status == true) {
            this.$store.commit('session/SET_CURRENT', res.data.session);
            this.$store.commit('snackbar/setMessage', { text: 'Your voucher has been cancelled.' });
          }
          this.overlay = false;
        }
      });
    },
    openAddVoucherDialog() {
      this.$refs.addVoucherDialog.open();
    },
    maskCode(voucher) {
      if (!voucher.issuedAt && this.$store.get('session/isNotAdmin')) {
        return voucher.code.substring(0, 2) + '***' + voucher.code.substring(5);
      }
      return voucher.code;
    }
  },
  mounted() {
    this.getVouchers();
  },
  components: {
    AddVoucher: () => import('./AddVoucher.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Overlay: () => import('@/component/app/Overlay.vue'),
  }
}
</script>
