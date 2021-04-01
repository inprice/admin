<template>
  <div v-if="report">

    <status-alert></status-alert>

    <div class="d-flex">
      <div>
        <div class="title">Dashboard</div>
        <div class="body-2">An overall information of your current status.</div>
      </div>

      <v-spacer></v-spacer>

      <div class="text-center my-auto" v-if="report.account && CURSTAT.isActive">
        <div class="mb-1 caption">{{ report.date | formatDate }}</div>
        <v-btn small @click="refresh">
          <v-icon left>mdi-refresh</v-icon> Refresh
          <br>
        </v-btn>
      </div>
    </div>

    <v-divider class="my-2"></v-divider>

    <div class="px-2 row">
      <!-- ------------------------------- -->
      <!-- Groups' position statuses -->
      <!-- ------------------------------- -->
      <v-card class="col" v-if="report && report.groups && report.groups.positionDists">
        <v-card-title class="pb-2">
          <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
          <div class="col pa-0">
            <div>Group positions</div>
            <div class="caption">The positions of your groups.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <positions-bar-chart 
          :width="300" :height="300"
          :series="report.groups.positionDists" 
        />
      </v-card>

      <!-- -------------------------------- -->
      <!-- Links status distributions -->
      <!-- -------------------------------- -->
      <v-card class="col" v-if="report && report.links && report.links.statusDists">
        <v-card-title class="pb-2">
          <v-icon class="mr-4 hidden-xs-only">mdi-layers-outline</v-icon>
          <div class="col pa-0">
            <div>Link statuses</div>
            <div class="caption">The statuses of your competitors.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <statuses-pie-chart
          :width="300" :height="300"
          :series="report.links.statusDists" 
        />
      </v-card>
    </div>


    <!-- ------------------------------------ -->
    <!-- 10 Groups having the lowest prices -->
    <!-- ------------------------------------ -->
    <v-card class="mt-3">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-down-circle-outline</v-icon>
        <div>
          <div>Top 10 with low prices</div>
          <div class="caption">Your 10 groups having the lowest prices.</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div 
        class="v-data-table v-data-table--dense theme--light put-behind" 
        v-if="report && report.groups && report.groups.extremePrices.lowest && report.groups.extremePrices.lowest.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.priceTable.name">Name</th>
                <th :width="RESPROPS.priceTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.priceTable.links" class="text-center">Links</th>
                <th :width="RESPROPS.priceTable.date" class="text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                style="cursor: pointer"
                link @click="$router.push({ name: 'group', params: { id: row.id } })"
                v-for="(row) in report.groups.extremePrices.lowest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td class="text-center">{{ row.actives + '/' + row.passives }}</td>
                <td class="text-center">
                  <ago :date="row.lastUpdate" />
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
    <!-- 10 Groups having the highest prices -->
    <!-- ------------------------------------- -->
    <v-card class="mt-3">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-up-circle-outline</v-icon>
        <div>
          <div>Top 10 with high prices</div>
          <div class="caption">Your 10 groups having the highest prices.</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div 
        class="v-data-table v-data-table--dense theme--light put-behind" 
        v-if="report && report.groups && report.groups.extremePrices.highest && report.groups.extremePrices.highest.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.priceTable.name">Name</th>
                <th :width="RESPROPS.priceTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.priceTable.links" class="text-center">Links</th>
                <th :width="RESPROPS.priceTable.date" class="text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                style="cursor: pointer"
                link @click="$router.push({ name: 'group', params: { id: row.id } })"
                v-for="(row) in report.groups.extremePrices.highest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td class="text-center">{{ row.actives + '/' + row.passives }}</td>
                <td class="text-center">
                  <ago :date="row.lastUpdate" />
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
    <!-- MRU 25 Links -->
    <!-- ------------------ -->
    <v-card class="mt-2">
      <v-card-title class="pa-2 d-flex">
        <v-icon class="mr-4 hidden-xs-only">mdi-account-search-outline</v-icon>
        <div>
          <div>Competitors</div>
          <div class="caption">Most recently updated 25 competitors.</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div class="v-data-table v-data-table--dense theme--light put-behind" v-if="report && report.links && report.links.mru25.length">
        <div class="v-data-table__wrapper">
          <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
            <thead>
              <tr>
                <th :width="RESPROPS.linksTable.seller" class="text-truncate">Seller & Platform | URL</th>
                <th :width="RESPROPS.linksTable.price" class="text-right">Price</th>
                <th :width="RESPROPS.linksTable.status">Status</th>
                <th :width="RESPROPS.linksTable.time">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in report.links.mru25" :key="index" :title="row.groupName">
                <td v-if="row.seller">{{ (row.seller || 'NA') + (' ('+row.platform+')' || '') }}</td>
                <td v-else class="font-italic">{{ row.url }}</td>
                <td class="text-right">{{ row.price | toPrice }}</td>
                <td>{{ row.status | formatStatus }}</td>
                <td>
                  <ago :date="row.lastUpdate" />
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
            linksTable: { seller: '', price: '15%', status: '18%', time: '18%' },
            priceTable: { name: '', price: '15%', links: '10%', date: '18%', action: '10%' }
          };
        }
        default: {
          return {
            'table-layout': 'fixed',
            linksTable: { seller: '300px', price: '150px', status: '150px', time: '150px' },
            priceTable: { name: '300px', price: '150px', links: '80px', date: '150px', action: '100px' }
          };
        }
      }
    },
  },
  methods: {
    async refresh() {
      const result = await DashboardService.refresh();
      this.report = result.data;
      if (this.report && this.report.account && this.report.account.renewalAt) {
        this.report.account.daysToRenewal = moment(this.report.account.renewalAt).diff(moment(), 'days')+1;
      }

      if (this.report && this.report.groups && this.report.groups.positionDists) {
        let linkCount = 0;
        for (var i = 0; i < this.report.groups.positionDists.length; i++) {
          const dist = this.report.groups.positionDists[i];
          linkCount += dist.count;
        }
        this.total.group = linkCount;

        let compCount = 0;
        if (this.report.links.statusDists) {
          for (var j = 0; j < this.report.links.statusDists.length; j++) {
            const comp = this.report.links.statusDists[j];
            compCount += comp.count;
          }
        }
        this.total.link = compCount;
      }
    },  
  },
  created() {
    this.refresh();
  },
  components: {
    PositionsBarChart: () => import('./PositionsBarChart.js'),
    StatusesPieChart: () => import('./StatusesPieChart.js'),
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
