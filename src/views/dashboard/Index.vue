<template>
  <div v-if="report">

    <status-alert></status-alert>

    <div class="d-flex">
      <div>
        <div class="title">Dashboard</div>
        <div class="body-2">An overall information of your current status.</div>
      </div>

      <v-spacer></v-spacer>

      <div class="text-center mt-1" v-if="report.account && CURSTAT.isActive">
        <v-btn small color="white" @click="refresh">
          Refresh
        </v-btn>
        <div class="mb-1 caption">{{ report.date | formatDate }}</div>
      </div>
    </div>

    <v-divider class="my-2"></v-divider>

    <div class="px-2 row">
      <!-- ------------------------------- -->
      <!-- Groups' position distributions   -->
      <!-- ------------------------------- -->
      <v-card class="col" v-if="report && report.groups && report.groups.levelSeries">
        <v-card-title class="pb-2">
          <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
          <div class="col pa-0">
            <div>Group levels</div>
            <div class="caption">The levels of your groups.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <positions-bar-chart
          :width="300" :height="300"
          :series="report.groups.levelSeries" 
        />
      </v-card>
      <!-- ------------------------------- -->
      <!-- Links' status distributions   -->
      <!-- ------------------------------- -->
      <v-card class="col" v-if="report && report.links && report.links.statusGroupSeries">
        <v-card-title class="pb-2">
          <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
          <div class="col pa-0">
            <div>Links statuses</div>
            <div class="caption">The statuses of your links.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <level-pie-chart
          :width="300" :height="300"
          :series="report.links.statusGroupSeries"
        />
      </v-card>
      <!-- ------------------------------- -->
      <!-- Links' position distributions   -->
      <!-- ------------------------------- -->
      <v-card class="col" v-if="report && report.links && report.links.levelSeries">
        <v-card-title class="pb-2">
          <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
          <div class="col pa-0">
            <div>Link levels</div>
            <div class="caption">The levels of your links.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <positions-bar-chart
          :width="300" :height="300"
          :series="report.links.levelSeries" 
        />
      </v-card>
    </div>


    <!-- ------------------------------------ -->
    <!-- N Groups having the lowest prices -->
    <!-- ------------------------------------ -->
    <v-card class="mt-4">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-down-circle-outline</v-icon>
        <div>
          <div>Low prices</div>
          <div class="caption">Top 5 groups with low prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div 
        class="v-data-table v-data-table--dense theme--light put-behind" 
        v-if="report && report.groups && report.groups.extremePrices.LOWEST && report.groups.extremePrices.LOWEST.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.priceTable.name">Name</th>
                <th :width="RESPROPS.priceTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.priceTable.links" class="text-center">Links</th>
                <th :width="RESPROPS.priceTable.date" class="text-center">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="cursor: pointer"
                link @click="$router.push({ name: 'group', params: { id: row.id } })"
                v-for="(row) in report.groups.extremePrices.LOWEST" :key="row.id">
                <td>{{ row.name }} {{ row.description ? '( ' + row.description + ' )' : '' }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td class="text-center">{{ row.actives + '/' + row.total }}</td>
                <td class="text-center">
                  <ago :date="row.updatedAt" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <block-message 
        v-else dense
        class="mb-0"
        :message="'No data.'"
      />
    </v-card>

    <!-- ------------------------------------- -->
    <!-- N Groups having the highest prices -->
    <!-- ------------------------------------- -->
    <v-card class="mt-4">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-up-circle-outline</v-icon>
        <div>
          <div>High prices</div>
          <div class="caption">Top 5 groups with high prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div 
        class="v-data-table v-data-table--dense theme--light put-behind" 
        v-if="report && report.groups && report.groups.extremePrices.HIGHEST && report.groups.extremePrices.HIGHEST.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.priceTable.name">Name</th>
                <th :width="RESPROPS.priceTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.priceTable.links" class="text-center">Links</th>
                <th :width="RESPROPS.priceTable.date" class="text-center">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                style="cursor: pointer"
                link @click="$router.push({ name: 'group', params: { id: row.id } })"
                v-for="(row) in report.groups.extremePrices.HIGHEST" :key="row.id">
                <td>{{ row.name }} {{ row.description ? '( ' + row.description + ' )' : '' }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td class="text-center">{{ row.actives + '/' + row.total }}</td>
                <td class="text-center">
                  <ago :date="row.updatedAt" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <block-message 
        v-else dense
        class="mb-0"
        :message="'No data.'"
      />
    </v-card>

    <!-- ------------------ -->
    <!-- MRU 10 Links -->
    <!-- ------------------ -->
    <v-card class="mt-4">
      <v-card-title class="pa-2 d-flex">
        <v-icon class="mr-4 hidden-xs-only">mdi-account-search-outline</v-icon>
        <div>
          <div>Links</div>
          <div class="caption">Most recently updated 10 links.</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div class="v-data-table v-data-table--dense theme--light put-behind" v-if="report && report.links && report.links.mru25.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.linksTable.seller" class="text-truncate">Name</th>
                <th :width="RESPROPS.linksTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.linksTable.time">Time</th>
                <th :width="RESPROPS.linksTable.status" class="text-truncate">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr 
              style="cursor: pointer"
              link @click="$router.push({ name: 'link', params: { id: row.id } })"
              :title="row.groupName"
              v-for="(row, index) in report.links.mru25" :key="index">
                <td>{{ (row.name || row.url) }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td>
                  <ago :date="row.updatedAt" />
                </td>
                <td>
                  <div v-if="!row.price || (row.status != 'ACTIVE' && row.level == 'NA')">{{ row.statusDesc }}</div>
                  <div v-else :class="{ 'green--text font-weight-bold': row.level == 'LOWEST', 'red--text font-weight-bold': row.level == 'HIGHEST' }">
                    {{ row.level }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <block-message 
        v-else dense
        class="mb-0"
        :message="'No data.'"
      />
    </v-card>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'

import DashboardService from '@/service/dashboard';
import moment from 'moment-timezone';

export default {
  data() {
    return {
      report: {},
      total: {
        group: 0,
        link: 0
      }
    };
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'md':
        case 'lg':
        case 'xl': {
          return {
            'table-layout': '',
            linksTable: { seller: '', price: '10%', time: '15%', status: '12%' },
            priceTable: { name: '', price: '10%', links: '10%', date: '15%', action: '10%' }
          };
        }
        default: {
          return {
            'table-layout': 'fixed',
            linksTable: { seller: '300px', price: '100px', time: '150px', status: '120px' },
            priceTable: { name: '300px', price: '100px', links: '80px', date: '150px', action: '100px' }
          };
        }
      }
    },
  },
  methods: {
    async refresh() {
      const result = await DashboardService.refresh();
      this.report = result.data;
      if (this.report && this.report.account && this.report.account.subsRenewalAt) {
        this.report.account.daysToRenewal = moment(this.report.account.subsRenewalAt).diff(moment(), 'days')+1;
      }

      if (this.report && this.report.groups && this.report.groups.positionSeries) {
        let linkCount = 0;
        for (var i = 0; i < this.report.groups.positionSeries.length; i++) {
          const dist = this.report.groups.positionSeries[i];
          linkCount += dist.count;
        }
        this.total.group = linkCount;

        let compCount = 0;
        if (this.report.links.statusSeries) {
          for (var j = 0; j < this.report.links.statusSeries.length; j++) {
            const comp = this.report.links.statusSeries[j];
            compCount += comp.count;
          }
        }
        this.total.link = compCount;
      }
    },  
  },
  mounted() {
    this.refresh();
  },
  components: {
    LevelPieChart: () => import('./LevelPieChart.js'),
    PositionsBarChart: () => import('./PositionsBarChart.js'),
    StatusAlert: () => import('@/component/app/StatusAlert.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>

<style scoped>
  .row > .v-card {
    margin: 5px;
    min-width: 250px;
  }
  td, th {
    padding: 0 3px;
  }
  td {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .v-card__title {
    padding: 0 0 0.8rem 0;
  }
  .row {
    margin-top: 7px;
  }
  .linear-table tr td {
    border-bottom: none !important;
  }
  .circular-table tr td {
    padding: 4px 0;
    border-bottom: none !important;
  }
</style>
