<template>
  <v-card tile class="mt-3">
    <v-card-title class="py-2">
      Overview
    </v-card-title>

    <v-card-text class="pt-3" v-if="wsinfo.workspace">
      <v-card>
        <table class="property-table">
          <tr>
            <th>Name</th>
            <td>{{ wsinfo.workspace.name }}</td>
            <th>User Limit</th>
            <td>{{ wsinfo.userCount }} / {{ (wsinfo.userLimit || 0) +1 }}</td>
          </tr>

          <tr>
            <th>Plan</th>
            <td>
              <div v-if="wsinfo.workspace.plan">
                {{ wsinfo.workspace.plan.name }} /
                {{ wsinfo.workspace.subsRenewalAt }} (<span class="green--text font-weight-medium">{{ wsinfo.workspace.status }}</span>)
              </div>
              <div v-else>
                Please select a plan on Plans section here.
              </div>
            </td>
            <th>Product Limit</th>
            <td>{{ wsinfo.productCount }} / {{ wsinfo.productLimit }}</td>
          </tr>

          <tr>
            <th>Currency</th>
            <td>{{ wsinfo.workspace.currencyCode }} - {{ wsinfo.workspace.currencyFormat }}</td>
            <th>Alarm Limit</th>
            <td>{{ wsinfo.alarmCount }} / {{ wsinfo.alarmLimit }}</td>
          </tr>
        </table>
      </v-card>
    </v-card-text>

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
import SystemService from '@/service/system';

export default {
  data() {
    return {
      wsinfo: {}
    }
  },
  methods: {
    async openWorkspaceInfoDialog() {
      const result = await WorkspaceService.get();
      if (result) {
        this.$refs.infoDialog.edit(result);
      }
    },
  },
  mounted() {
    SystemService.getStatistics().then((res) => {
      if (res && res.status) {
        this.wsinfo = res.data;
      }
    });
  },
  components: {
    InfoDialog: () => import('./InfoDialog.vue'),
  }
}
</script>
