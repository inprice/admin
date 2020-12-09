<template>
  <div>

    <v-alert
      v-if="(session.companyStatus == 'FREE' || session.companyStatus == 'COUPONED') && session.daysToRenewal <= 7"
      dense
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      <div class="d-flex justify-space-between">
        <span v-if="session.daysToRenewal <= 0">
          Your {{ freeIndicator }} period has ended <ago class="d-inline font-weight-bold" :date="session.subsRenewalAt" />.
        </span>
        <span v-if="session.daysToRenewal == 1 || session.daysToRenewal == 2">
          Your {{ freeIndicator }} period will be ending <strong>{{ session.subsRenewalAt | formatUSDate }}</strong>.
        </span>
        <span v-if="session.daysToRenewal > 2">
          You've started {{ freeIndicator }} period <ago class="d-inline font-weight-bold" :date="session.subsRenewalAt" />.
          There are only {{session.daysToRenewal}} days left to end.
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
      v-if="session.companyStatus == 'SUBSCRIBED'"
      dense
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      <div class="d-flex justify-space-between">
        <span v-if="session.daysToRenewal < 0">
          Your subscription has ended <ago class="d-inline font-weight-bold" :date="session.subsRenewalAt" />.
        </span>
        <span v-if="session.daysToRenewal == 0 || session.daysToRenewal == 1">
          Your subscription will be renewed <strong>{{ session.daysToRenewal == 0 ? 'today' : 'tomorrow'}}</strong>.
        </span>
        <v-btn 
          v-if="session.daysToRenewal < 0"
          small
          color="success"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </v-alert>

    <v-alert
      v-if="isPassiveStatus"
      dense
      colored-border
      color="cyan darken-1"
      elevation="2"
      type="info"
    >
      <div class="d-flex justify-space-between">
        <span>
          You have no active subscription right now.
          <span v-if="session.productCount > 0">You need to start a subscription to continue monitoring your competitors.</span>
          <span v-if="session.productCount == 0 && session.companyStatus == 'NOT_SET'">Would you like to start with free use period?</span>
          <span v-if="session.productCount == 0 && session.companyStatus != 'NOT_SET'">Would you like to subscribe a plan to begin monitoring?</span>
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
export default {
  props: {
    session: Object
  },
  computed: {
    isPassiveStatus() {
      return ! (
        this.session.companyStatus == 'FREE' || 
        this.session.companyStatus == 'COUPONED' || 
        this.session.companyStatus == 'SUBSCRIBED'
      );
    },
    freeIndicator() {
      if (this.session.companyStatus == 'FREE') {
        return '30 days free trial';
      } else {
        return 'coupon';
      }
    },
  }
}
</script>
