<template>
  <v-card tile class="mt-3">
    <v-card-title class="py-2">
      Edit workspace
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pt-3">
      <table class="desc-table">
        <tr>
          <th>Name</th>
          <td>{{ WORKSPACE.name }}</td>
        </tr>
        <tr>
          <th>Currency</th>
          <td>{{ WORKSPACE.currency }}</td>
        </tr>
        <tr>
          <th>Format</th>
          <td>{{ WORKSPACE.currencyFormat }}</td>
        </tr>
      </table>
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

    <info-dialog ref="infoDialog"></info-dialog>
  </v-card>
</template>

<script>
import WorkspaceService from '@/service/workspace';
import { get } from 'vuex-pathify'

export default {
  computed: {
    WORKSPACE: get('session/getWorkspaceInfo'),
  },
  methods: {
    async openWorkspaceInfoDialog() {
      const result = await WorkspaceService.get();
      if (result) {
        this.$refs.infoDialog.edit(result);
      }
    },
  },
  components: {
    InfoDialog: () => import('./InfoDialog.vue'),
  }
}
</script>
