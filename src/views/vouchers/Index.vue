<template>
  <div>
    <div>
      <div class="title">Vouchers</div>
      <div class="body-2">Manage your vouchers for your workspace.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-5">
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-ticket-confirmation-outline</v-icon>
            <div class="d-inline">
              <div>The list</div>
              <div class="caption">A combined list of vouchers that assigned, applied and created by you</div>
              <div class="caption">
                <strong>Please note:</strong> Available vouchers can only be used when you have no active subscription or trial use!
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn 
              small
              class="ml-2"
              color="success"
              v-if="CURSTAT.isActive == false"
              :disabled="$store.get('session/isNotAdmin')"
              @click="openApplyVoucherDialog"
            >
              Apply voucher
            </v-btn>

            <v-btn 
              small dark
              class="ml-2"
              color="red"
              v-if="CURSTAT.status == 'VOUCHERED'"
              :disabled="$store.get('session/isNotAdmin')"
              @click="cancel"
            >
              Cancel
            </v-btn>

            <v-btn
              small
              color="white"
              class="my-auto ml-2"
              @click="getVouchers"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="vouchers.length">
        <v-divider></v-divider>

        <table class="pb-2 info-table">
          <thead>
            <tr>
              <th width="10%">Code</th>
              <th width="10%">Days</th>
              <th width="15%">Status</th>
              <th width="15%">Issued At</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cpn in vouchers" :key="cpn.id">
              <td class="font-weight-bold">{{ maskCode(cpn) }}</td>
              <td class="font-weight-bold">{{ cpn.days }}</td>
              <td>
                <v-chip small label outlined v-if="cpn.issuedAt">USED</v-chip>
                <div v-else>
                  <v-chip small label outlined dark v-if="$store.get('session/isAdmin')" color="teal">AVAILABLE</v-chip>
                  <v-chip small label outlined dark v-else color="red">ADMIN NEEDED</v-chip>
                </div>
              </td>
              <td>
                <ago :date="cpn.issuedAt" v-if="cpn.issuedAt" />
                <v-btn
                  v-else small dark
                  class="my-1"
                  color="light-blue"
                  :disabled="loading.apply || CURSTAT.isActive == true || $store.get('session/isNotAdmin')"
                  @click="apply(cpn.code)"
                  style="min-width: 75%; max-height: 80%"
                >
                  Use
                </v-btn>
              </td>
              <td>{{ cpn.description }}</td>
            </tr>
          </tbody>
        </table>

      </div>

      <block-message 
        v-else dense
        :message="'No assigned or used voucher in this workspace.'"
      />

    </v-card>

    <apply-voucher ref="applyVoucherDialog" @applied="getVouchers(true)" />
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
        apply: false,
      },
      vouchers: []
    };
  },
  methods: {
    getVouchers(fromDialog) {
      if (fromDialog) {
        this.$refs.applyVoucherDialog.close();
      }
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
    async apply(code) {
      if (code) {
        this.$refs.confirm.open('Voucher', 'is going to be applied right now. Are you sure?', 'This voucher').then(async (confirm) => {
          if (confirm == true) {
            this.applyVoucher(code);
          }
        });
      }
    },
    async applyVoucher(code) {
      this.loading.apply = true;
      const result = await VoucherService.applyVoucher(code);
      if (result && result.status == true) {
        this.$store.commit('session/SET_CURRENT', result.data.session);
        this.$store.commit('snackbar/setMessage', { text: 'Your voucher has been successfully applied.' });
        this.getVouchers();
      }
      this.loading.apply = false;
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
    openApplyVoucherDialog() {
      this.$refs.applyVoucherDialog.open();
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
    ApplyVoucher: () => import('./Apply.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Overlay: () => import('@/component/app/Overlay.vue'),
  }
}
</script>
