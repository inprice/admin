<template>
  <v-menu 
    offset-y 
    bottom right
    v-model="menuOpened"
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex" v-bind="attrs" v-on="on">
        <div class="title">{{ CURSTAT.workspace }}</div>
        <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </div>
    </template>

    <v-list dense v-if="CURSTAT.workspace != 'Please bind a workspace'">
      <div v-if="sesList && sesList.length > 1">
        <template v-for="(ses, i) in sesList">
          <v-list-item
            :key="i"
            :href="findPath(i)"
            v-if="CURSTAT.workspace != ses.workspace || CURSTAT.email != ses.email"
          >
            <v-icon class="mr-3">mdi-swap-horizontal</v-icon>
            <v-list-item-content>
              <v-list-item-title>{{ ses.workspace }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ ses.email }} 
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-chip 
                outlined 
                small label 
                color="green"
                class="font-weight-medium"
              >
                {{ ses.role }}
              </v-chip>
            </v-list-item-action>
          </v-list-item>
        </template>
        <v-divider></v-divider>
      </div>

      <v-list-item :to="{name: 'workspace-settings'}">
        <v-icon class="mr-3">mdi-cog-outline</v-icon>
        <v-list-item-content>
          <v-list-item-title>SETTINGS</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click.stop="openCreateWorkspace">
        <v-icon class="mr-3">mdi-folder-plus-outline</v-icon>
        <v-list-item-content>
          <v-list-item-title>CREATE NEW WORKSPACE</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="/login?m=addNew" target="_blank">
        <v-icon class="mr-3">mdi-account-arrow-right-outline</v-icon>
        <v-list-item-content>
          <v-list-item-title>LOGIN ANOTHER WORKSPACE</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list dense v-if="$store.get('session/isSuperUser')">
      <v-divider></v-divider>
      <v-list-item v-if="!CURSTAT.workspaceId" :to="{name: 'sys-workspaces'}">
        <v-icon class="mr-3">mdi-lan-connect</v-icon>
        <v-list-item-content>
          <v-list-item-title>BIND TO A WORKSPACE {{ CURSTAT.workspaceId }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-else @click="unbindWorkspace">
        <v-icon class="mr-3">mdi-lan-disconnect</v-icon>
        <v-list-item-content>
          <v-list-item-title>UNBIND CURRENT</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <workspace-info-dialog ref="workspaceInfoDialog"></workspace-info-dialog>
  </v-menu>
  
</template>

<script>
import moment from 'moment-timezone';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    sesList: get('session/getSessionList'),
  },
  data() {
    return {
      menuOpened: false,
    }
  },
  methods: {
    openCreateWorkspace() {
      this.menuOpened = false;
      this.$refs.workspaceInfoDialog.edit();
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

      let toPage = 'welcome';
      if (hasTime) {
        if (session.linkCount > 0) {
          toPage = 'dashboard';
        } else {
          toPage = 'products';
        }
      }
      return `/${sesNo}/app/${toPage}`;
    }
  },
  components: {
    WorkspaceInfoDialog: () => import('./workspace/InfoDialog.vue'),
  }
}
</script>
