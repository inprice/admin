<template>
  <div v-if="report">

    <v-divider class="mt-2"></v-divider>
    <div class="title text-center">Links</div>
    <v-divider></v-divider>

    <v-row>
      <v-card class="col px-0 pb-0 mr-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Status
        </div>

        <v-card v-if="report && report.linkStatusCounts && report.linkStatusCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Status</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.linkStatusCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>

        <block-message 
          v-else dense
          class="mb-0"
          :message="loading ? 'Loading, please wait...' : 'No data.'"
        />
      </v-card>

      <v-card class="col px-0 pb-0 ml-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Group
        </div>

        <v-card v-if="report && report.linkGrupCounts && report.linkGrupCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Group</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.linkGrupCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>
    </v-row>

    <v-divider class="mt-5"></v-divider>
    <div class="title text-center">Tickets</div>
    <v-divider></v-divider>

    <v-row>
      <v-card class="col px-0 pb-0 mr-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Status
        </div>

        <v-card v-if="report && report.ticketStatusCounts && report.ticketStatusCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Status</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.ticketStatusCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>

        <block-message 
          v-else dense
          class="mb-0"
          :message="loading ? 'Loading, please wait...' : 'No data.'"
        />
      </v-card>

      <v-card class="col px-0 pb-0 mx-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Priority
        </div>

        <v-card v-if="report && report.ticketPriorityCounts && report.ticketPriorityCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.ticketPriorityCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>

      <v-card class="col px-0 pb-0 mx-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Type
        </div>

        <v-card v-if="report && report.ticketTypeCounts && report.ticketTypeCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Type</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.ticketTypeCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>

      <v-card class="col px-0 pb-0 ml-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Subject
        </div>

        <v-card v-if="report && report.ticketSubjectCounts && report.ticketSubjectCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.ticketSubjectCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>
    </v-row>

    <v-divider class="mt-5"></v-divider>
    <div class="title text-center">General</div>
    <v-divider></v-divider>

    <v-row>
      <v-card class="col px-0 pb-0 mr-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Workspace
        </div>

        <v-card v-if="report && report.workspaceStatusCounts && report.workspaceStatusCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Status</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.workspaceStatusCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>

        <block-message 
          v-else dense
          class="mb-0"
          :message="loading ? 'Loading, please wait...' : 'No data.'"
        />
      </v-card>

      <v-card class="col px-0 pb-0 ml-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          User
        </div>

        <v-card v-if="report && report.userTimezoneCounts && report.userTimezoneCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Timezones</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.userTimezoneCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>

      <v-card class="col px-0 pb-0 ml-1" :loading="loading" flat>
        <div class="pb-2 teal--text subtitle text-center">
          Product
        </div>

        <v-card v-if="report && report.productPositionCounts && report.productPositionCounts.length">
          <table class="pb-2 info-table">
            <thead>
              <tr>
                <th>Position</th>
                <th width="10%" class="text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, ix) in report.productPositionCounts" :key="ix" :class="{ 'font-weight-medium text-uppercase red--text' : row.left == 'Total' }">
                <td>{{ row.left }}</td>
                <td class="text-right">{{ row.right }}</td>
              </tr>
            </tbody>
          </table>
        </v-card>
      </v-card>
    </v-row>

  </div>
</template>

<script>
import SU_DashboardService from '@/service/super/dashboard';

export default {
  data() {
    return {
      loading: false,
      report: {},
    };
  },
  methods: {
    refresh() {
      this.loading = true;
      SU_DashboardService.refresh().then(result => {
        this.report = result.data;
      }).finally(() => this.loading = false);
    },
  },
  mounted() {
    this.refresh();
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>

<style scoped>
  .info-table {
    font-size: 85% !important;
  }
  .info-table tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  .info-table tr:hover {
    background-color: #e5e5e5;
  }
  .list-table td {
    padding: 8px;
  }
</style>