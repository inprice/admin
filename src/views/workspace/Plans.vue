<template>
  <div>
    <div class="title mt-5 mb-2">All Plans</div>

    <v-card tile
      v-for="plan in plansSets" :key="plan.id"
      :class="`py-2 ${isThisSelected(plan.id) ? 'rainbow px-4' : 'px-5'}`"
    >
      <v-row no-gutters>
        <v-col sm="6" md="4" class="my-auto body-1 primary--text font-weight-bold">
          <v-icon 
            color="success"
            class="mr-2 hidden-sm-and-down" 
          >
            {{ isThisSelected(plan.id) ? 'mdi-check' : 'mdi-circle-small' }}
          </v-icon>
          <span>{{ plan.name }}</span>
        </v-col>

        <v-col class="body-2 my-auto">
          <b>{{ firstTitleRow(plan) }}</b> {{ secondTitleRow(plan) }}
        </v-col>

        <v-col class="my-auto text-right">
          <v-btn
            small
            @click="subscribe(plan.id)"
            v-if="CURSTAT.isSubscriber == false"
            :disabled="$store.get('session/isNotAdmin')" 
          >
            Subscribe
          </v-btn>

          <div v-if="CURSTAT.isSubscriber == true && CURSTAT.planId !== undefined">
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
        </v-col>
      </v-row>
    </v-card>

    <div class="title mt-5">Contact us</div>

    <v-card class="mt-2 pa-3">
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