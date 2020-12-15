<template>
  <div>
    <v-menu
      v-model="menu"
      offset-y
      :nudge-width="200"
      max-width="350"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-card class="text-center">
        <v-icon large class="pt-4">mdi-account-check</v-icon>
        <v-list-item two-line class="pt-0">
          <v-list-item-content class="pt-2">
            <v-list-item-title class="title">{{ CURSTAT.company }}</v-list-item-title>
            <v-list-item-subtitle class="my-2">
              <v-chip outlined class="font-weight-medium" v-if="CURSTAT.isActive">
                {{ CURSTAT.planName }}
                <span class="green--text mx-2">| {{ CURSTAT.status }} |</span>
                <span>
                  {{ prettyRemainingDays() }}
                </span>
              </v-chip>
              <v-btn
                v-else
                text
                small
                outlined
                color="info"
                :to="{ name: 'plans' }"
                :disabled="$route.name == 'plans'"
                @click="menu=false"
              >
                Please select a plan!
              </v-btn>

            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card>

      <v-card>
        <v-list subheader>
          <div v-if="sessions.length">
            <template v-for="({ email, company, role }, i) in sessions">
              <v-list-item
                v-if="email != CURSTAT.email || company != CURSTAT.company"
                :key="i"
                :href="`/${i}/app/dashboard`"
                target="_blank"
                @click="menu=!menu"
              >
                <v-icon class="mr-3">mdi-account-arrow-right-outline</v-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ company }}</v-list-item-title>
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
            <v-list-item-content>
              <v-list-item-subtitle>Add another account</v-list-item-subtitle>
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
          @click="logout"
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
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      menu: false
    }
  },
  computed: {
    sessions: get('auth/sessions'),
    CURSTAT: get('auth/CURRENT_STATUS'),
  },
  methods: {
    openChangePasswordDialog() {
      this.menu = false;
      this.$refs.changePasswordDialog.open(this.CURSTAT.email);
    },
    logout() {
      this.$store.dispatch('auth/logout', false);
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
