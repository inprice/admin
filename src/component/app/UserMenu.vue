<template>
  <div>
    <v-menu
      v-model="menu"
      offset-y
      :nudge-width="200"
      :max-width="($vuetify.breakpoint.smAndDown ? '90%' : '30%')"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card class="text-center">
        <v-icon large class="pt-4">mdi-account-check</v-icon>
        <v-list-item two-line>
          <v-list-item-content class="pa-0 mx-auto">
            <v-list-item-title class="title">{{ CURSTAT.account }}</v-list-item-title>
            <v-list-item-subtitle class="mb-2 py-2">
              <v-chip outlined class="font-weight-medium" v-if="CURSTAT.isActive">
                {{ CURSTAT.planName }} |
                <span class="green--text px-2">{{ CURSTAT.status }}</span>
                <span>
                  | {{ prettyRemainingDays() }}
                </span>
              </v-chip>
              <v-btn
                v-else
                text
                small
                outlined
                color="info"
                :to="{ name: 'plans' }"
                @click="menu=false"
              >
                Please select a plan!
              </v-btn>

            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card class="tiling-card">
        <v-list subheader class="pb-0">
          <div v-if="sesList && sesList.length">
            <template v-for="({ email, account, role }, i) in sesList">
              <v-list-item
                v-if="email != CURSTAT.email || account != CURSTAT.account"
                :key="i"
                :href="findPath(i)"
                target="_blank"
                @click="menu=!menu"
              >
                <v-icon class="mr-3">mdi-account-arrow-right-outline</v-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ account }}</v-list-item-title>
                  <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                </v-list-item-content>

                <div class="text-right">
                  <v-chip small outlined color="success">
                    {{ role }}
                  </v-chip>
                </div>
              </v-list-item>
            </template>
          </div>

          <v-list-item :href="`/login?m=addNew`" target="_blank">
            <v-icon class="mr-3">mdi-plus</v-icon>
            <v-list-item-content flat>
              <v-list-item-subtitle>Login to another account</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>

      <v-card class="text-center">
        <v-btn
          text
          outlined
          small
          class="my-3"
          color="info"
          @click="$store.dispatch('session/logout', false)"
        >
          Log out
        </v-btn>

        <v-divider/>
        
         <div class="py-4">
          <div class="text-center">
            <v-btn text small class="text-none">Privacy Policy</v-btn>
            |
            <v-btn text small class="text-none">Terms of Services</v-btn>
          </div>
        </div>

       </v-card>

    </v-menu>
  </div>
</template>

<script>
import moment from 'moment-timezone';
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      menu: false
    }
  },
  computed: {
    sesList: get('session/getSessionList'),
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    openChangePasswordDialog() {
      this.menu = false;
      this.$refs.changePasswordDialog.open(this.CURSTAT.email);
    },
    findPath(sesNo) {
      const session = this.sesList[sesNo];
      const renewal = moment(session.renewalAt, 'YYYY-MM-DD').tz(session.timezone);
      const dayDiff = renewal.diff(moment().startOf('day'), 'days');
      const base = (session.accountStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
      const hasTime = (dayDiff >= base && session.accountStatus != 'CANCELLED' && session.accountStatus != 'STOPPED');

      let toPage = 'plans';
      if (hasTime) {
        if (session.productCount > 0) {
          toPage = 'dashboard';
        } else {
          toPage = 'products';
        }
      } else {
        toPage = 'plans';
      }
      return `/${sesNo}/app/${toPage}`;
    },
    prettyRemainingDays() {
      let res;
      if (this.CURSTAT.daysToRenewal < 0) 
        res = Math.abs(this.CURSTAT.daysToRenewal) + ' days ago';
      else if (this.CURSTAT.daysToRenewal == 0) 
        res = 'Today';
      else if (this.CURSTAT.daysToRenewal == 1) 
        res = 'Tomorrow';
      else if (this.CURSTAT.daysToRenewal < 8) 
        res = this.CURSTAT.daysToRenewal + ' days left';
      else
        res = this.$options.filters.formatUSDate(this.CURSTAT.renewalAt);
      return res;
    }
  }
}
</script>

<style scoped>
  .v-sheet.v-card {
    border-radius: 0;
  }
  .v-list-item__content {
    max-width: 250px;
  }
</style>