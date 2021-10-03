<template>
  <v-menu 
    offset-y 
    bottom right
    v-model="menuOpened"
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="d-flex" v-bind="attrs" v-on="on">
        <div class="title">{{ CURSTAT.workspace || 'No workspace selected' }}</div>
        <v-icon class="ml-2">mdi-chevron-down</v-icon>
      </div>
    </template>

    <v-list dense>
      <v-list-item :to="{name: 'workspace-settings'}" :disabled="$store.get('session/isNotAdmin')">
        <v-icon class="mr-3">mdi-cog-outline</v-icon>
        <v-list-item-content>
          <v-list-item-subtitle>SETTINGS</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <div v-if="sesList && sesList.length > 1">
        <v-divider></v-divider>
        <v-subheader>YOUR WORKSPACES</v-subheader>

        <template v-for="({ email, workspace, role }, i) in sesList">
          <v-list-item
            v-if="email != CURSTAT.email || workspace != CURSTAT.workspace"
            :key="i"
            :href="findPath(i)"
            target="_blank"
            @click="menu=!menu"
          >
            <v-icon class="mr-3">mdi-account-arrow-right-outline</v-icon>
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

      <v-divider></v-divider>

      <v-list-item @click.stop="openCreateWorkspace" :disabled="$store.get('session/isDemoUser')">
        <v-icon class="mr-3">mdi-folder-plus-outline</v-icon>
        <v-list-item-content>
          <v-list-item-title>CREATE A NEW WORKSPACE</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!--v-list-item :href="`/login?m=addNew`" target="_blank">
        <v-list-item-content>
          <v-list-item-subtitle>LOGIN WITH ANOTHER EMAIL</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item-->
    </v-list>

    <v-list dense v-if="$store.get('session/isSuperUser')">
      <v-list-item v-if="!CURSTAT.workspaceId" :to="{name: 'sys-workspaces'}">
        <v-icon class="mr-3">mdi-link-variant</v-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Bind to a workspace</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-else @click="unbindWorkspace">
        <v-icon class="mr-3">mdi-link-variant-off</v-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Unbind current</v-list-item-subtitle>
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

      let toPage = 'plans';
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
    WorkspaceInfoDialog: () => import('./workspace/Info.vue'),
  }
}
</script>
