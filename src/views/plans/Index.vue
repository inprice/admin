<template>
  <div>
    <div>
      <div class="title">Plans</div>
      <div class="body-2">The plans and the rules for subscription.</div>
    </div>

    <v-divider class="my-2"></v-divider>
    
    <v-card v-if="CURSTAT.status == 'CREATED'">
      <v-card-title class="pb-2">
        <v-icon class="mr-2 hidden-xs-only">mdi-arrow-right-thin-circle-outline</v-icon>
        <div>
          <div>Free use</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-4" style="background-color: lightyellow">
        You have a <b>Free-Use</b> right! You are highly advised to start with a <b>14-day free</b> trial period.
        <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
          <v-btn
            small 
            text outlined
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

    <v-card class="my-5">
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.smAndDown ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-format-list-bulleted</v-icon>
            <div class="d-inline">
              <div>Table</div>
              <div class="caption"><strong>Please note that</strong> all the prices in this table are monthly basis and in US dollar currency!</div>
            </div>
          </div>
          <div :class="'my-auto text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right')">
            <v-btn
              small
              text outlined
              @click="refreshSession"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh Session
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-card>
        <block-message 
          class="mb-0"
          v-if="CURSTAT.isFree && $store.get('session/isAdmin')">
          Your actual status is {{ CURSTAT.status }}. It's ending {{ prettyRemainingDaysForFree() }}
          You can subscribe to any plan below
          <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
            <v-btn 
              small
              text outlined
              color="error"
              class="my-auto"
              @click="cancel()"
              :disabled="$store.get('session/isNotAdmin')"
            >
              Or Cancel
            </v-btn>
          </div>
        </block-message>

        <block-message
          class="mb-0" 
          v-if="CURSTAT.isActive == false && CURSTAT.status != 'CREATED'"
        >
          This account has been {{ CURSTAT.status.toLowerCase() }}
          <ago class="d-inline" :date="CURSTAT.lastStatusUpdate" />
        </block-message>
      </v-card>

      <v-divider></v-divider>

      <div class="d-flex flex-wrap justify-space-around py-1">
        <v-hover v-for="plan in plansSets" :key="plan.id">
          <template v-slot="{ hover }">
            <v-card 
              :style="{ 'min-width': findMinWidthForPlans }"
              class="transition-swing text-center ma-2 pb-1" 
              :class="`elevation-${hover ? 10 : 3} ${isThisSelected(plan.id) ? 'rainbow' : ''}`">

              <div class="headline grey lighten-4 py-2 elevation-1 ">
                <div class="title teal--text text-uppercase">
                  {{ plan.name.replace(' Plan', '') }}
                </div>

                <v-divider class="my-2"></v-divider>
                <div class="text-h5">
                  {{ firstTitleRow(plan) }}
                </div>
                <div class="caption">
                  {{ secondTitleRow(plan) }}
                </div>
              </div>

              <v-divider></v-divider>

              <div class="ma-2 pr-1 caption text-left">
                <table>
                  <tr v-for="feature in plan.features" :key="feature.id">
                    <td width="40%" class="text-right">
                      <v-icon v-if="feature.allowed" color="success">mdi-check-circle-outline</v-icon>
                      <v-icon v-else color="grey)">mdi-minus-circle-outline</v-icon>
                    </td>
                    <td width="3%">
                    </td>
                    <td :class="{ 'font-weight-light': !feature.allowed }">
                      {{ feature.feature }}
                    </td>
                  </tr>
                </table>
              </div>

              <v-divider class="mb-3"></v-divider>

              <v-btn
                tile
                class="mb-2"
                @click="subscribe(plan.id)"
                v-if="CURSTAT.isSubscriber == false"
                :disabled="$store.get('session/isNotAdmin')" 
              >
                Subscribe
              </v-btn>

              <div v-if="CURSTAT.isSubscriber == true && CURSTAT.planId !== undefined">
                <v-btn
                  text outlined
                  color="error"
                  class="mb-2"
                  @click="cancel()"
                  v-if="plan.id == CURSTAT.planId"
                  :disabled="$store.get('session/isNotAdmin')" 
                >
                  Cancel
                </v-btn>
                <v-btn 
                  v-else
                  text outlined
                  class="mb-2"
                  @click="changeTo(plan.id)"
                  :color="plan.id > CURSTAT.planId ? 'success' : 'cyan'"
                  :disabled="$store.get('session/isNotAdmin')"
                >
                  {{ plan.id > CURSTAT.planId ? 'UPGRADE' : 'DOWNGRADE' }}
                </v-btn>
              </div>

            </v-card>

          </template>
        </v-hover>
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <v-icon class="mr-2 hidden-xs-only">mdi-email-edit-outline</v-icon>
        <div>
          <div>Contact us</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-4">
        You need something special than the plans we offer? We will be more than happy to assist you.
        <a href="mailto:support@inprice.io?subject=Request for additional features">Please click here to send an email</a> us explaining your needs.
      </div>
    </v-card>

    <info-dialog ref="info"></info-dialog>
    <confirm ref="confirm"></confirm>
    <overlay :show="loading.overlay" @cancelled="cancelCheckout" />
    
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      currentCheckoutHash: null,
      loading: {
        overlay: false,
        tryFreeUse: false,
      },
    }
  },
  computed: {
    plansSets: get('system/plansSets'),
    CURSTAT: get('session/getCurrentStatus'),
    findMinWidthForPlans() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '95%'
        case 'sm':
          return '45%'
        default:
          return '31%'
      }
    }
  },
  methods: {
    async startFreeUse() {
      this.$refs.confirm.open('Free Use', 'is going to be started now. Are you sure?', 'Your 14 days free plan').then(async (confirm) => {
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
    async subscribe() {
      this.$refs.info.open('Sorry!', 'We are working really hard to implement our payment gateway and it is about to be completed soon. Thank you for your interest.');
    //async subscribe(planId) {
      /*
      this.loading.overlay = true;
      const result = await SubsService.createCheckout(planId);
      if (result.status == true) {
        this.currentCheckoutHash = result.data.hash;
        if (!stripe) stripe = window.Stripe(process.env.VUE_APP_STRIPE_PK);
        stripe.redirectToCheckout({
          sessionId: result.data.sessionId
        }).then((result) => {
          this.loading.overlay = false;
          if (result.error && result.error.message) {
            this.$store.commit('snackbar/setMessage', { text: result.error.message, level: 'error' });
          } else {
            console.log('Calling result of stripes checkout form', result);
          }
        }).catch((err) => {
          if (err instanceof DOMException) {
            this.$store.commit('snackbar/setMessage', { text: 'Please use the platform on a normal browser!', level: 'error' });
          } else {
            this.$store.commit('snackbar/setMessage', { text: err.message, level: 'error' });
          }
          this.cancelCheckout();
        });
      } else {
        this.loading.overlay = false;
        this.currentCheckoutHash = null;
      }
      */
    },
    async changeTo(planId) {
      const dir = (planId > this.CURSTAT.planId ? 'UPGRADED' : 'DOWNGRADED');
      this.$refs.confirm.open('Change Plan', 'will be '+dir+'. Are you sure?', 'Your actual plan').then(async (confirm) => {
        if (confirm == true) {
          this.loading.overlay = true;
          const res = await SubsService.changeTo(planId);
          if (res.status == true) {

            let retry = 0;
            const refreshId = setInterval(() => {
              this.$store.dispatch('session/refresh'); 
              if (this.CURSTAT.planId == planId || retry >= 5) {
                clearInterval(refreshId);
                this.loading.overlay = false;
                this.$store.commit('snackbar/setMessage', { text: 'Your subscription has been successfully ' + dir });
              }
              retry++;
            }, 1000);

          } else {
            this.loading.overlay = false;
          }
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
    cancelCheckout() {
      this.loading.overlay = false;
      SubsService.cancelCheckout(this.currentCheckoutHash);
      this.currentCheckoutHash = null;
    },
    firstTitleRow(plan) {
      if (this.CURSTAT.planId == plan.id) {
        if (this.CURSTAT.isSubscriber) {
          return this.CURSTAT.status;
        } else if (this.CURSTAT.status == 'FREE') {
          return 'FREE USE';
        } else if (this.CURSTAT.status == 'COUPONED') {
          return 'COUPON USE';
        }
      }
      return '$' + plan.price.toFixed(2);
    },
    secondTitleRow(plan) {
      if (this.isThisSelected(plan.id)) {
        if (this.CURSTAT.daysToRenewal > 0)
          return this.$options.filters.formatUSDate(this.CURSTAT.subsRenewalAt) + ' - ' + this.CURSTAT.daysToRenewal + ' days left';
        else
          return this.$options.filters.formatUSDate(this.CURSTAT.subsRenewalAt);
      }
      return 'per month';
    },
    isThisSelected(planId) {
      return (this.CURSTAT.isActive && this.CURSTAT.planId == planId);
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
    refreshSession() {
      this.$store.dispatch('session/refresh');
    }
  },
  mounted() {
    if (!this.plansSets || !this.plansSets.length) {
      this.$store.dispatch('system/fetchPlans');
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    InfoDialog: () => import('@/component/InfoDialog.vue'),
    Overlay: () => import('@/component/app/Overlay.vue')
  }
};
</script>

<style scoped>
  .rainbow {
    border: 5px solid transparent;
    border-radius: 5px;
    border-image-source: linear-gradient(to bottom right, yellow 0%, darkorange 100%); 
    border-image-slice: 5;
  }
</style>