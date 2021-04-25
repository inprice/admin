<template>
  <div>
    <div>
      <div class="title">Plans</div>
      <div class="body-2">The plans and the rules for subscription.</div>
    </div>

    <v-divider class="mt-2"></v-divider>
    <h1>{{CURSTAT.status}}</h1>
    <v-card class="mt-3" v-if="CURSTAT.status == 'CREATED'">
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

    <v-card class="my-3">
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
            <v-btn small @click="refreshSession">
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
              color="error"
              class="my-auto"
              @click="cancel()"
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

              <ul class="my-2 pr-1">
                <div class="caption mt-1 pl-" v-for="(feature, index) in plan.features" :key="index">
                  <span :class="{'font-weight-medium': index==0||index==3, 'blue--text darken-2': index==3}" >{{ feature }}</span>
                </div>
              </ul>

              <v-divider class="mb-3"></v-divider>

              <v-btn
                tile
                :disabled="$store.get('session/isNotAdmin')" 
                v-if="CURSTAT.isSubscriber == false"
                class="mb-2"
                @click="subscribe(plan.id)"
              >
                Subscribe
              </v-btn>

              <div v-if="CURSTAT.isSubscriber == true && CURSTAT.planId !== undefined">
                <v-btn
                  :disabled="$store.get('session/isNotAdmin')" 
                  v-if="plan.id == CURSTAT.planId"
                  color="error"
                  class="mb-2"
                  @click="cancel()"
                >
                  Cancel
                </v-btn>
                <v-btn 
                  v-else
                  :disabled="$store.get('session/isNotAdmin')"
                  :color="plan.id > CURSTAT.planId ? 'success' : 'cyan'"
                  class="mb-2"
                  @click="changeTo(plan.id)"
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
        Do you need something special than the plans we offer? We will be happy to assist you.
        <a href="mailto:support@inprice.io?subject=Request for additional features">Please click/touch here to send an email</a> us explaining your needs.
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <v-icon class="mr-2 hidden-xs-only">mdi-alert-circle-outline</v-icon>
        <div>
          <div>Please keep in mind</div>
          <div class="subtitle-2">For only subscribers!</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-3">

        <div class="my-2 teal--text font-weight-medium">Before choosing a plan</div>
        <ul class="ml-4">
          <li>Please select one of them which suits most your needs.</li>
          <li>All the plans displaying in this page are in monthly subscription model.</li>
          <li>And all the prices are in US dollar currency.</li>
        </ul>

        <v-divider class="my-3"></v-divider>

        <div class="my-2 teal--text font-weight-medium">Want to change payment method</div>
        <ul class="ml-4">
          <li>Please cancel your actual plan first.</li>
          <li>Then subscribe it again with your new payment instrument.</li>
        </ul>

        <v-divider class="my-3"></v-divider>

        <div class="my-2 teal--text font-weight-medium">Want to change your actual plan</div>
        <ol class="ml-4">
          <li>You are completely free to either downgrade or upgrade whenever you want.</li>
          <li>You see three types of buttons under each plan box above;
            <ul>
              <li><strong>DOWNGRADE</strong>: You can downgrade to this plan.</li>
              <li><strong>CANCEL</strong>: You can cancel your actual subscription.</li>
              <li><strong>UPGRADE</strong>: You can upgrade to this plan.</li>
            </ul>
          </li>
          <li>For upgrading, a proportional invoice (taking into the remaining days) will be created for the difference between two plans.</li>
          <li>For downgrading, 
            <ul>
              <li>you will be allowed when your account's link count equal or less than new plan.</li>
              <li>if there are more than three days to renewal from your actual plan, we will issue a coupon to compensate those days.</li>
            </ul>
          </li>
        </ol>

        <v-divider class="my-3"></v-divider>

        <div class="my-2 teal--text font-weight-medium">After cancelling</div>
        <ul class="ml-4">
          <li>Your feedbacks are always very important to us, please let us know the reason.</li>
          <li>Please note that: there is <span class="red--text font-weight-bold">no refund for cancel!</span></li>
          <li>If you have an active subscription and there is more than three days to renewal, 
            <ul>
              <li>Instead, we will issue a coupon for you to compensate those days.</li>
              <li>You (or your friends) can use those coupons whenever you want.</li>
            </ul>
          </li>
        </ul>

      </div>
    </v-card>

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
      if (this.CURSTAT.planName == plan.name) {
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
          return this.$options.filters.formatUSDate(this.CURSTAT.renewalAt) + ' - ' + this.CURSTAT.daysToRenewal + ' days left';
        else
          return this.$options.filters.formatUSDate(this.CURSTAT.renewalAt);
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
  created() {
    this.$nextTick(() => {
      if (!this.plansSets || !this.plansSets.length) {
        this.$store.dispatch('system/fetchPlans');
      }
    });
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    Overlay: () => import('@/component/app/Overlay.vue'),
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