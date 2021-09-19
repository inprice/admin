<template>
  <div>
    <v-menu
      v-model="menu"
      offset-y
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-workspace</v-icon>
        </v-btn>
      </template>

      <v-card class="text-center" width="350px">
        <div class="py-2">
          <v-icon large>mdi-workspace-check</v-icon>
          <div class="body-2">{{ CURSTAT.email }}</div>
          <v-btn
            small
            class="my-2"
          >
            Settings
          </v-btn>
        </div>

        <v-divider class="pb-2"></v-divider>

        <div class="title" style="white-space: normal">{{ CURSTAT.workspace }}</div>

        <div class="py-3" v-if="CURSTAT.isActive">
          <v-chip outlined class="font-weight-medium">
            <div>{{ CURSTAT.planName }} |</div>
            <div class="green--text px-2">{{ CURSTAT.status }}</div>
            <div>| {{ prettyRemainingDays() }}</div>
          </v-chip>
        </div>

        <div
          class="py-3"
          v-if="$store.get('session/isSuperUser') || (!CURSTAT.isActive && $store.get('session/isNotSuperUser'))"
        >
          <v-btn
            text
            outlined
            v-if="!CURSTAT.workspaceId && $store.get('session/isSuperUser')"
            :to="{ name: 'sys-workspaces' }"
            @click="menu=false"
          >
            Bind an workspace
          </v-btn>
          <v-btn
            text
            outlined
            v-else-if="$store.get('session/isSuperUser')"
            @click="unbindWorkspace"
          >
            Unbind Selected Workspace
          </v-btn>

          <v-btn
            small
            color="info"
            v-else-if="!CURSTAT.isActive && $store.get('session/isNotSuperUser')"
            :to="{ name: 'plans' }"
            @click="menu=false"
          >
            Please select a plan!
          </v-btn>

        </div>
      </v-card>

      <v-card class="tiling-card">
        <v-list subheader class="pb-0">
          <div v-if="sesList && sesList.length">
            <template v-for="({ email, workspace, role }, i) in sesList">
              <v-list-item
                v-if="email != CURSTAT.email || workspace != CURSTAT.workspace"
                :key="i"
                :href="findPath(i)"
                target="_blank"
                @click="menu=!menu"
              >
                <v-icon class="mr-3">mdi-workspace-arrow-right-outline</v-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ workspace }}</v-list-item-title>
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

          <v-list-item :href="`/login?m=addNew`" target="_blank" v-if="$store.get('session/isNotSuperUser')">
            <v-icon class="mr-3">mdi-plus</v-icon>
            <v-list-item-content flat>
              <v-list-item-subtitle>Login to another workspace</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

        </v-list>
      </v-card>

      <v-card class="text-center">
        <v-btn
          small
          class="my-3"
          color="warning"
          @click="$store.dispatch('session/logout', false)"
        >
          Log out
        </v-btn>
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
    unbindWorkspace() {
      this.$store.dispatch('session/unbindWorkspace');
    },
    findPath(sesNo) {
      const session = this.sesList[sesNo];
      const renewal = moment(session.subsRenewalAt, 'YYYY-MM-DD').tz(session.timezone);
      const dayDiff = renewal.diff(moment().startOf('day'), 'days');
      const base = (session.workspaceStatus == 'SUBSCRIBED' ? -3 : 0); //subscribers can use the system for extra three days!!!
      const hasTime = (dayDiff >= base && session.workspaceStatus != 'CANCELLED' && session.workspaceStatus != 'STOPPED');

      let toPage = 'plans';
      if (hasTime) {
        if (session.linkCount > 0) {
          toPage = 'dashboard';
        } else {
          toPage = 'products';
        }
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
        res = this.$options.filters.formatUSDate(this.CURSTAT.subsRenewalAt);
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
    max-width: 350px;
  }
</style>