<template>
  <div>
    <div class="title pl-1">
      Plans
    </div>

    <v-card class="mt-2" v-if="session.companyStatus == 'NOT_SET'">
      <v-card-title>
        <v-icon class="mr-2">mdi-arrow-right-thin-circle-outline</v-icon>
        <div>
          <div>Free use</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex justify-space-between pa-4">
        <div>
          You have a Free-Use right! You are highly advised to start with a 30-day free trial period.
        </div>
        <v-btn
          small 
          color="success"
          class="my-auto ml-3"
          :loading="loading.tryFreeUse" 
          :disabled="loading.tryFreeUse"
          @click="startFreeUse"
        >
          Let me try
        </v-btn>
      </div>
    </v-card>

    <v-card class="mt-4 mb-2">
      <v-card-title>
        <v-icon class="mr-4">mdi-format-list-bulleted</v-icon>
        <div>
          <div>Plans table</div>
          <div class="caption"><strong>Please note that</strong> all the prices in this table are monthly basis and in US dollar currency!</div>
        </div>
      </v-card-title>

        <no-data 
          v-if="session.companyStatus == 'CANCELLED' || session.companyStatus == 'STOPPED'"
          :message="'Your current subscription has been ' + session.companyStatus.toLowerCase()"
        >
          <ago class="d-inline" :date="session.lastStatusUpdate" />! Please select a new plan below.
        </no-data>

      <v-divider></v-divider>

      <template v-for="(plansSet, ix) in plansSets">
        <div class="pt-4 px-1 text-center d-flex" :class="{'pb-4': ix==plansSets.length-1}" :key="ix">
          <v-hover v-for="plan in plansSet" :key="plan.id">
            <template v-slot="{ hover }">
              <v-card class="mx-2 pa-2 transition-swing col" :class="`elevation-${hover ? 10 : 3} ${isThisPlanSelected(plan.name) ? 'rainbow' : ''}`">
                <div class="headline grey lighten-4 elevation-1 py-2 ">
                  <div class="title teal--text darken-5 text-uppercase">
                    <v-icon color="#00D63F" v-if="isThisPlanSelected(plan.name)">mdi-checkbox-marked-circle</v-icon>
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

                <v-divider 
                  class="mb-4"
                  v-if="session.companyStatus != 'SUBSCRIBED'"
                ></v-divider>

                <v-btn 
                  v-if="session.companyStatus != 'SUBSCRIBED'"
                  dark
                  color="teal"
                  class="mx-auto mb-2"
                  @click="subscribe(plan.id)"
                >
                  Subscribe
                </v-btn>

              </v-card>
            </template>
          </v-hover>
        </div>
      </template>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-email-edit-outline</v-icon>
        <div>
          <div>Contact us</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-4">
        Do you need something special than the plans we offer? We will be happy to assist you.
        <a href="mailto:support@inprice.io?subject=Request for additional features">Please click here to send an email</a> us explaining your needs.
      </div>
    </v-card>

    <v-card class="mt-4">
      <v-card-title>
        <v-icon class="mr-2">mdi-alert-circle-outline</v-icon>
        <div>
          <div>Please keep in mind</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-3">

        <div class="my-2 black--text">Before choosing a plan</div>
        <ul class="ml-4">
          <li>Please select one of them which suits most your needs.</li>
          <li>All the plans displaying in this page are in monthly subscription model.</li>
          <li>And all the prices are in US dollar currency.</li>
          <li>You can cancel your actual plan whenever you want <strong class="text-decoration-underline red--text">but no refund!</strong></li>
        </ul>

        <v-divider class="my-3"></v-divider>

        <div class="my-2 black--text">Want to change payment method</div>
        <ul class="ml-4">
          <li>Please cancel your actual plan first.</li>
          <li>Then subscribe it again with your new payment instrument.</li>
        </ul>

        <v-divider class="my-3"></v-divider>

        <div class="my-2 black--text">Want to change your plan</div>
        <ol class="ml-4">
          <li>If you wish to downgrade or upgrade, please cancel your actual plan first.</li>
          <li>Then select new plan. In this way, you will not face any extra cost.</li>
          <li>The remaining days from cancelled plan will be added on top of new plan's starting day.</li>
          <li>Existing product count in your account is important indicator. Please consider followings;</li>
          <li>If your product count is less than or equal to new plan's limit, no problem. You can pass and use new plan.</li>
          <li>Otherwise, ie. your product count is greater than new plan's limit, please do one of the followings
            <ul>
              <li>You can select a broader plan</li>
              <li>Or delete some of your products before transition.</li>
            </ul>
          </li>
        </ol>
      </div>
    </v-card>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import SystemService from '@/service/system';
import { get } from 'vuex-pathify'

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PK);

export default {
  data() {
    return {
      loading: {
        tryFreeUse: false,
      },
    }
  },
  computed: {
    session: get('auth/session'),
    plansSets: get('system/plansSets'),
  },
  methods: {
    async startFreeUse() {
      this.$refs.confirm.open('Free Use', 'is going to be started now. Are you sure?', 'Your 30 days free plan').then(async (confirm) => {
        if (confirm == true) {
          this.loading.tryFreeUse = true;
          const result = await SubsService.startFreeUse();

          if (result.status == true) {
            SystemService.refreshSession()
              .then((res) => {
                if (res) {
                  this.$store.commit('auth/REFRESH_SESSION', res.data.session);
                }
            });
          } else {
            this.$store.dispatch('auth/refreshSession');
          }
          this.loading.tryFreeUse = false;
        }
      });
    },
    async subscribe(planId) {
      const loader = this.$loading.show();

      const result = await SubsService.createCheckout(planId);
      if (result.status == true) {
        stripe.redirectToCheckout({
          sessionId: result.data.sessionId
        }).then(function (result) {
          loader.hide();
          if (result.error && result.error.message) {
            this.$store.commit('snackbar/setMessage', { text: result.error.message, color: 'error' });
          } else {
            console.log('Calling result of stripes checkout form', result);
          }
        });
      } else {
        loader.hide();
      }
    },
    firstTitleRow(plan) {
      if (this.session.planName == plan.name) {
        if (this.session.companyStatus == 'SUBSCRIBED') {
          return this.session.companyStatus;
        } else if (this.session.companyStatus == 'FREE') {
          return 'FREE USE';
        } else if (this.session.companyStatus == 'COUPONED') {
          return 'COUPON USE';
        }
      }
      return '$' + plan.price.toFixed(2);
    },
    secondTitleRow(plan) {
      if (this.session.planName == plan.name) {
        if (this.session.companyStatus == 'SUBSCRIBED') {
          return 'renews ' + (this.session.daysToRenewal > 2 ? ' on ' : '') + this.$options.filters.formatUSDate(this.session.subsRenewalAt);
        } else if (this.session.companyStatus == 'FREE' || this.session.companyStatus == 'COUPONED') {
          return 'ends ' + (this.session.daysToRenewal > 2 ? ' on ' : '') +  this.$options.filters.formatUSDate(this.session.subsRenewalAt);
        }
      }
      return 'per month';
    },
    isThisPlanSelected(planName) {
      return (this.session.planName == planName && this.hasCompanyActiveStatus(this.session.companyStatus, this.session.daysToRenewal));
    }
  },
  mounted() {
    this.$nextTick(async () => {
      if (!this.plansSets || !this.plansSets.length) {
        this.$store.dispatch('system/fetchPlans');
      }
    });
  },
  components: {
    NoData: () => import('@/component/simple/NoData.vue'),
    confirm: () => import('@/component/Confirm.vue'),
  }
};
</script>

<style scoped>
  .selected-true {
    border: 6px solid #00D63F;
  }
</style>