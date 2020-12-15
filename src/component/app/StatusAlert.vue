<template>
  <div>

    <v-alert
      v-if="CURSTAT.isFree && CURSTAT.daysToRenewal <= 7"
      dense
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      <div class="d-flex justify-space-between">
        <span v-if="CURSTAT.daysToRenewal <= 0">
          Your {{ freeIndicator() }} period has ended <ago class="d-inline font-weight-bold" :date="CURSTAT.renewalAt" />.
        </span>
        <span v-if="CURSTAT.daysToRenewal == 1 || CURSTAT.daysToRenewal == 2">
          Your {{ freeIndicator() }} period will be ending <strong>{{ CURSTAT.renewalAt | formatUSDate }}</strong>.
        </span>
        <span v-if="CURSTAT.daysToRenewal > 2">
          You've started {{ freeIndicator() }} period <ago class="d-inline font-weight-bold" :date="CURSTAT.renewalAt" />.
          There are only {{ CURSTAT.daysToRenewal }} days left to end.
        </span>
        <v-btn 
          small
          color="success"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </v-alert>

    <v-alert
      v-if="CURSTAT.isSubscriber && CURSTAT.hasTime && CURSTAT.daysToRenewal < 2"
      dense
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      Your subscription will be renewed <strong>{{ CURSTAT.daysToRenewal == 0 ? 'today' : 'tomorrow'}}</strong>.
    </v-alert>

    <v-alert
      v-if="!CURSTAT.isActive"
      dense
      colored-border
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      <div class="d-flex justify-space-between">
        <span>
          You have no active subscription right now. {{ infoForPassiveCompany() }}
        </span>
        <v-btn 
          small
          color="success"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
        </div>
    </v-alert>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('auth/CURRENT_STATUS'),
  },
  methods: {
    freeIndicator() {
      if (this.CURSTAT.status == 'FREE') {
        return '30 days free trial';
      } else {
        return 'coupon';
      }
    },
    infoForPassiveCompany() {
      if (this.CURSTAT.hasProduct) {
        return "You need to start a subscription to continue monitoring.";
      } else {
        if (this.CURSTAT == 'CREATED') {
          return "You can start with a free trial perid for 30 days.";
        } else {
          return "Would you like to subscribe a plan to start monitoring?";
        }
      } 
    }
  }
}
</script>
