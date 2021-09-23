<template>
  <div>

    <block-message v-if="CURSTAT.isFree && CURSTAT.daysToRenewal <= 7" dense>
      <span v-if="CURSTAT.daysToRenewal == 0 || CURSTAT.daysToRenewal == 1">
        Your {{ freeIndicator() }} is ending <strong>{{ CURSTAT.daysToRenewal == 0 ? 'TODAY' : 'TOMORROW' }}</strong>.
      </span>
      <span v-else>
        You've started {{ freeIndicator() }} period <ago class="d-inline font-weight-bold" :date="CURSTAT.subsRenewalAt" />.
        There are only <strong>{{ CURSTAT.daysToRenewal }} days</strong> left to end.
      </span>
      <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center' : 'right float-right')">        
        <v-btn 
          small
          color="primary"
          class="ml-2"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </block-message>

    <block-message v-if="CURSTAT.isSubscriber && CURSTAT.hasTime && CURSTAT.daysToRenewal < 2" dense>
      Your subscription will be renewed <strong>{{ CURSTAT.daysToRenewal == 0 ? 'TODAY' : 'TOMORROW'}}</strong>.
    </block-message>

    <block-message v-if="!CURSTAT.isActive">
      You have no active subscription right now. {{ infoForPassiveWorkspace() }}
      <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center' : 'right float-right')">
        <v-btn 
          small
          color="success"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>
      </div>
    </block-message>

  </div>
</template>

<script>
import SystemConsts from '@/data/system';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    freeIndicator() {
      if (this.CURSTAT.status == 'FREE') {
        return SystemConsts.LIMITS.DAYS_FOR_FREE_USE + ' days free trial';
      } else {
        return 'credit';
      }
    },
    infoForPassiveWorkspace() {
      if (this.CURSTAT.linkCount > 0) {
        return "You need to start a new subscription to continue monitoring.";
      } else {
        if (this.CURSTAT == 'CREATED') {
          return "You can start with a free trial perid for "+SystemConsts.LIMITS.DAYS_FOR_FREE_USE+" days.";
        } else {
          return "Would you like to subscribe to a plan?";
        }
      } 
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>
