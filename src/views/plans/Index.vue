<template>
  <div>
    <div class="title pl-1">
      Plans
    </div>

    <v-card class="mt-2" v-if="company && (company.subsStatus == 'NOT_SET' || company.subsStatus == 'FREE')">
      <v-card-title>
        <v-icon class="mr-2">mdi-arrow-right-thin-circle-outline</v-icon>
        <div>
          <div>Free use</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="d-flex justify-space-between pa-4" v-if="company.subsStatus == 'NOT_SET'">
        <div>
          You have a Free-Use right! Before begin, you are advised to use the platform free for 30 days.
        </div>
        <v-btn 
          color="info"
          class="my-auto"
          :loading="loading.tryFreeUse" 
          :disabled="loading.tryFreeUse"
          @click="startFreeUse"
        >
          Let me try
        </v-btn>
      </div>

      <FreePlanTexts class="pa-4" v-else :daysToRenewal="company.daysToRenewal" :subsRenewalAt="company.subsRenewalAt" />
    </v-card>

    <v-card class="mt-4 mb-2">
      <v-card-title>
        <v-icon class="mr-4">mdi-format-list-bulleted</v-icon>
        <div>
          <div>Plans table</div>
          <div class="caption"><strong>Please note that</strong> all the prices in this table are monthly basis and in Euro currency!</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="mx-1 py-1 text-center row">
        <v-hover v-for="plan in plansSet" :key="plan.id">
          <template v-slot="{ hover }">
            <v-card class="col pa-1 ma-2 pb-4 transition-swing" :class="`elevation-${hover ? 10 : 3}`">
              <div class="headline grey lighten-4 elevation-1 py-2 ">
                <div class="subtitle-1 teal--text text-uppercase ">{{ plan.name }}</div>
                <div class="text-h5">
                  {{ '$' + plan.price.toFixed(2) }} 
                  <span style="vertical-align: super;" class="caption font-weight-light"> / monthly</span>
                </div>
              </div>

              <v-divider></v-divider>

              <ul class="my-2 pr-1 text-left">
                <span class="caption text-uppercase">Features</span>
                <li class="caption mt-1" v-for="(feature, index) in plan.features" :key="index">
                  {{ feature }}
                </li>
              </ul>

              <v-divider class="mb-4"></v-divider>

              <v-btn 
                :loading="loading.subscribe" 
                :disabled="loading.subscribe"
                color="success"
                class="mx-auto"
                @click="subscribe(plan.id)"
              >
                Subscribe
              </v-btn>
            </v-card>
          </template>
        </v-hover>
      </div>
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
          <div>Before choose a plan</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div class="pa-3">
        Please keep in mind
        <ul class="ml-4">
          <li>All the plans displaying below is in monthly basis subscription model and US dollar currency. </li>
          <li>Please select one of them which suits most your needs.</li>
          <li>You can cancel your active plan whenever you want but no refund.</li>
          <li>You can downgrade or upgrade to another plan whenever you want without extra cost.</li>
          <li>After downgrade or upgrade, you will be charging with new plan's cost on the day your current plan ends.</li>
        </ul>
      </div>
    </v-card>

    <confirm ref="confirm"></confirm>
  </div>

</template>

<script>
import SubsService from '@/service/subscription';
import SystemService from '@/service/system';
import { get } from 'vuex-pathify'
import moment from 'moment-timezone';

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PK);

export default {
  props: ['status'],
  data() {
    return {
      loading: {
        subscribe: false,
        tryFreeUse: false,
      },
      company: null,
      plansSet: [],
    }
  },
  computed: {
    session: get('auth/session'),
  },
  methods: {
    async startFreeUse() {
      this.$refs.confirm.open('Free Use', 'is going to be started now. Are you sure?', 'Your 30 days free plan').then(async (confirm) => {
        if (confirm == true) {
          this.loading.tryFreeUse = true;
          const result = await SubsService.startFreeUse();
          if (result.status == true) {
            this.company.subsStatus = 'FREE';
            this.company.freeUsage = true;
            this.company.subsRenewalAt = moment(moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss'));
            this.company.daysToRenewal = moment(this.company.subsRenewalAt).diff(moment(), 'days')+1;
          }
          this.loading.tryFreeUse = false;
        }
      });
    },
    async subscribe(planId) {
      this.loading.subscribe = true;
      const result = await SubsService.createSession(planId);
      if (result.status == true) {
        stripe.redirectToCheckout({
          sessionId: result.data.sessionId
        }).then(function (result) {
          if (result.error && result.error.message) {
            this.$store.commit('snackbar/setMessage', { text: result.error.message, color: 'error' });
          } else {
            console.log('Calling result of stripes checkout form', result);
          }
        });
      }
      this.loading.subscribe = false;
    },
  },
  mounted() {
    this.$nextTick(async () => {
      SystemService.fetchPlans()
        .then((res) => {
          if (res && res.data) {
            this.company = res.data.company;
            this.plansSet = res.data.plans;
            if (this.company.subsRenewalAt) {
              this.company.daysToRenewal = moment(this.company.subsRenewalAt).diff(moment(), 'days')+1;
            }
          }
        });
    });
  },
  components: {
    confirm: () => import('@/component/Confirm.vue'),
    FreePlanTexts: () => import('@/component/app/FreePlanTexts.vue'),
  }
};
</script>
