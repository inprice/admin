<template>
  <v-card tile class="mt-3">
    <v-card-title class="py-2">
      Edit workspace
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pt-3">
      Change your workspace's name and currency info.
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3">
      <v-btn 
        small
        :disabled="$store.get('session/isNotAdmin')"
        @click="openWorkspaceInfoDialog"
      >
        Edit
      </v-btn>
    </v-card-actions>

    <workspace-info-dialog ref="workspaceInfoDialog"></workspace-info-dialog>
  </v-card>
</template>

<script>
import WorkspaceService from '@/service/workspace';

export default {
  methods: {
    async openWorkspaceInfoDialog() {
      const result = await WorkspaceService.get();
      if (result) {
        this.$refs.workspaceInfoDialog.edit(result);
      }
    },
  },
  components: {
    WorkspaceInfoDialog: () => import('./Info.vue'),
  }
}
</script>
