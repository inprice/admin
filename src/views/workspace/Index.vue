<template>
  <div>
    <div class="d-flex my-3">
      <div class="title">{{ CURSTAT.workspace }}</div>
      <v-spacer></v-spacer>
      <v-btn 
        small
        :disabled="$store.get('session/isNotAdmin')"
        @click="openWorkspaceInfoDialog"
      >
        Edit
      </v-btn>
    </div>

    <v-card class="mt-5">
      <v-card-title class="justify-space-between">
        <div>
          <v-icon color="green" class="mr-4 hidden-xs-only">mdi-folder-plus-outline</v-icon>
          Create a new workspace
        </div>
        <v-btn
          small
          class="my-auto"
          @click="openCreateWorkspace"
        >
          Create
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="body-2 black--text">
        Use this section when you need an extra workspace. <br/> And please keep in mind, you will be able to see newly created workspace after sign in again.
      </v-card-text>
    </v-card>

    <users></users>

    <delete-workspace></delete-workspace>

    <workspace-info-dialog ref="workspaceInfoDialog"></workspace-info-dialog>

  </div>
</template>

<script>
import WorkspaceService from '@/service/workspace';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    async openWorkspaceInfoDialog() {
      const result = await WorkspaceService.get();
      if (result) {
        this.$refs.workspaceInfoDialog.edit(result, false);
      }
    },
    openCreateWorkspace() {
      this.$refs.workspaceInfoDialog.edit(null, true);
    },
  },
  components: {
    Users: () => import('./Users'),
    DeleteWorkspace: () => import('./DeleteWorkspace'),
    WorkspaceInfoDialog: () => import('./WorkspaceInfo.vue'),
  }
};
</script>