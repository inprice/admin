<template>
  <div>
    <div>
      <div class="title">Credits</div>
      <div class="body-2">Manage your credits for your workspace.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <v-card class="mt-5">
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-ticket-confirmation-outline</v-icon>
            <div class="d-inline">
              <div>The list</div>
              <div class="caption">A combined list of credits that assigned, applied and created by you</div>
              <div class="caption">
                <strong>Please note:</strong> Available credits can only be used when you have no active subscription or Free Use!
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
              @click="openApplyCreditDialog"
            >
              Apply credit
            </v-btn>

            <v-btn 
              small dark
              class="ml-2"
              color="red"
              v-if="CURSTAT.status == 'CREDITED'"
              :disabled="$store.get('session/isNotAdmin')"
              @click="cancel"
            >
              Cancel
            </v-btn>

            <v-btn
              small
              color="white"
              class="my-auto ml-2"
              @click="getCredits"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="credits.length">
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
            <tr v-for="cpn in credits" :key="cpn.id">
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
        :message="'No assigned or used credit in this workspace.'"
      />

    </v-card>

    <apply-credit ref="applyCreditDialog" @applied="getCredits" />
    <confirm ref="confirm"></confirm>

    <overlay :show="overlay" />
    
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import CreditService from '@/service/credit';
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
      credits: []
    };
  },
  methods: {
    getCredits() {
      this.loading.refresh = true;
      CreditService.getCredits()
        .then((res) => {
          if (res && res.data) {
            this.credits = res.data;
          } else {
            this.credits = [];
          }
          this.loading.refresh = false;
        });
    },
    async apply(code) {
      if (code) {
        this.$refs.confirm.open('Credit', 'is going to be applied right now. Are you sure?', 'This credit').then(async (confirm) => {
          if (confirm == true) {
            this.applyCredit(code);
          }
        });
      }
    },
    async applyCredit(code) {
      this.loading.apply = true;
      const result = await CreditService.applyCredit(code);
      if (result && result.status == true) {
        this.$store.commit('session/SET_CURRENT', result.data.session);
        this.$store.commit('snackbar/setMessage', { text: 'Your credit has been successfully applied.' });
        this.getCredits();
      }
      this.loading.apply = false;
    },
    cancel() {
      this.$refs.confirm.open('Cancel Credit', 'will be cancelled. Are you sure?', 'Your actual credit use').then(async (confirm) => {
        if (confirm == true) {
          this.overlay = true;
          const res = await SubsService.cancel();
          if (res && res.status == true) {
            this.$store.commit('session/SET_CURRENT', res.data.session);
            this.$store.commit('snackbar/setMessage', { text: 'Your credit has been cancelled.' });
          }
          this.overlay = false;
        }
      });
    },
    openApplyCreditDialog() {
      this.$refs.applyCreditDialog.open();
    },
    maskCode(credit) {
      if (!credit.issuedAt && this.$store.get('session/isNotAdmin')) {
        return credit.code.substring(0, 2) + '***' + credit.code.substring(5);
      }
      return credit.code;
    }
  },
  mounted() {
    this.getCredits();
  },
  components: {
    ApplyCredit: () => import('./Apply.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Overlay: () => import('@/component/app/Overlay.vue'),
  }
}
</script>
