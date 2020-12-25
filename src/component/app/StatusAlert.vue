<template>
  <div>

    <block-message v-if="CURSTAT.isFree && CURSTAT.daysToRenewal <= 7" dense>
      <div class="d-flex justify-space-between">
        <span v-if="CURSTAT.daysToRenewal == 0 || CURSTAT.daysToRenewal == 1">
          Your {{ freeIndicator() }} is ending <strong>{{ CURSTAT.daysToRenewal == 0 ? 'TODAY' : 'TOMORROW' }}</strong>.
        </span>
        <span v-else>
          You've started {{ freeIndicator() }} period <ago class="d-inline font-weight-bold" :date="CURSTAT.renewalAt" />.
          There are only <strong>{{ CURSTAT.daysToRenewal }} days</strong> left to end.
        </span>
        <v-btn 
          small
          color="primary"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </block-message>

    <block-message v-if="CURSTAT.isSubscriber && CURSTAT.hasTime && CURSTAT.daysToRenewal < 2" dense>
      Your subscription will be renewed <strong>{{ CURSTAT.daysToRenewal == 0 ? 'TODAY' : 'TOMORROW'}}</strong>.
    </block-message>

    <block-message v-if="!CURSTAT.isActive" dense>
      <div class="d-flex justify-space-between">
        <span>
          You have no active subscription right now. {{ infoForPassiveAccount() }}
        </span>
        <v-btn 
          small
          color="success"
          class="ml-3 my-auto"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </block-message>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    freeIndicator() {
      if (this.CURSTAT.status == 'FREE') {
        return '30 days free trial';
      } else {
        return 'coupon';
      }
    },
    infoForPassiveAccount() {
      if (this.CURSTAT.hasProduct) {
        return "You need to start a subscription to continue monitoring.";
      } else {
        if (this.CURSTAT == 'CREATED') {
          return "You can start with a free trial perid for 30 days.";
        } else {
          return "Would you like to subscribe a plan?";
        }
      } 
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>
