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

    <block-message
      class="mb-0" 
      v-if="CURSTAT.isActive == false && CURSTAT.status != 'CREATED'"
    >
      This workspace has been {{ CURSTAT.status.toLowerCase() }}
      <ago class="d-inline" :date="CURSTAT.lastStatusUpdate" />
    </block-message>

    <div class="title mt-5">All Plans</div>

    <v-expansion-panels focusable class="mt-2">
      <v-expansion-panel 
        v-for="plan in plansSets" :key="plan.id"
        :class="`${isThisSelected(plan.id) ? 'rainbow' : ''}`"
      >
        <v-expansion-panel-header>

          <v-row no-gutters>
            <v-col sm="6" md="4" class="body-1 primary--text font-weight-bold">
              <v-icon class="ml-0 mr-1" color="success">{{ isThisSelected(plan.id) ? 'mdi-check-circle' : 'mdi-circle-small' }}</v-icon>
              <span>{{ plan.name }}</span>
            </v-col>
            <v-col class="body-2 my-auto">
              {{ firstTitleRow(plan) }} {{ secondTitleRow(plan) }}
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="caption">
          <div>
            <div class="py-3 subtitle-2">{{ plan.description }}</div>

            <div class="d-flex justify-space-between">

              <div class="ml-3">
                <div 
                  class="py-1"
                  v-for="(feature, ix) in plan.features" :key="ix"
                >
                  <span>
                    <v-icon v-if="feature.allowed" color="success">mdi-check-circle-outline</v-icon>
                    <v-icon v-else color="pink">mdi-minus-circle-outline</v-icon>
                  </span>
                  <span :class="{ 'font-weight-light': !feature.allowed }">
                    {{ feature.description }}
                  </span>
                </div>

              </div>

              <div class="mr-3">
                <v-btn
                  small
                  class="mt-4"
                  @click="subscribe(plan.id)"
                  v-if="CURSTAT.isSubscriber == false"
                  :disabled="$store.get('session/isNotAdmin')" 
                >
                  Subscribe
                </v-btn>

                <div class="mt-4" v-if="CURSTAT.isSubscriber == true && CURSTAT.planId !== undefined">
                  <v-btn
                    color="error"
                    @click="cancel()"
                    v-if="plan.id == CURSTAT.planId"
                    :disabled="$store.get('session/isNotAdmin')" 
                  >
                    Cancel
                  </v-btn>
                  <v-btn 
                    v-else
                    dark
                    @click="changeTo(plan.id)"
                    :color="plan.id > CURSTAT.planId ? 'success' : 'cyan'"
                    :disabled="$store.get('session/isNotAdmin')"
                  >
                    {{ plan.id > CURSTAT.planId ? 'UPGRADE' : 'DOWNGRADE' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

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

    <div class="title mt-8">Contact us</div>

    <v-card class="mt-3 pa-3">
      You need something special than the plans we offer? We will be more than happy to assist you.
      <a href="mailto:support@inprice.io?subject=Request for additional features">Please click here to send an email</a> us explaining your needs.
    </v-card>

    <info-dialog ref="info"></info-dialog>
    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
import SystemService from '@/service/system';
import SubsService from '@/service/subscription';
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      plansSets: null,
      loading: {
        overlay: false,
        tryFreeUse: false,
      },
    }
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
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
    firstTitleRow(plan) {
      if (this.CURSTAT.planId == plan.id) {
        if (this.CURSTAT.isSubscriber) {
          return this.CURSTAT.status;
        } else if (this.CURSTAT.status == 'FREE') {
          return 'FREE USE';
        } else if (this.CURSTAT.status == 'VOUCHERED') {
          return 'VOUCHER USE';
        }
      }
      return '$' + plan.price.toFixed(2);
    },
    secondTitleRow(plan) {
      if (this.isThisSelected(plan.id)) {
        if (this.CURSTAT.daysToRenewal > 0)
          return ' - ' + this.$options.filters.formatUSDate(this.CURSTAT.subsRenewalAt) + ' - ' + this.CURSTAT.daysToRenewal + ' days left';
        else
          return ' - ' + this.$options.filters.formatUSDate(this.CURSTAT.subsRenewalAt);
      }
      return ' / month';
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
    },
    subscribe() {
      this.$refs.info.open('Sorry!', 'Our payment gateway is not yet fully operational. We will make an announcement when it is completed. Thank you for your interest.');
    }
  },
  mounted() {
    const self = this;
    this.$nextTick(() => {
      SystemService.fetchPlans()
        .then((res) => {
          if (res && res.data) {
            self.plansSets = res.data;
          }
        });
    });
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    InfoDialog: () => import('@/component/InfoDialog.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  },
}
</script>

<style scoped>
  .rainbow {
    border: 5px solid transparent;
    border-radius: 5px;
    border-image-source: linear-gradient(to bottom right, yellow 0%, darkorange 100%); 
    border-image-slice: 5;
  }
  .v-icon.v-icon {
    font-size: 20px;
  }
</style>