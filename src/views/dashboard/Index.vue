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
        <v-btn small color="white" @click="refresh">
          Refresh
        </v-btn>
      </div>
    </div>

    <v-divider class="my-2"></v-divider>

    <div class="row justify-space-around">
      <!-- ------------------------------- -->
      <!-- Links' position distributions   -->
      <!-- ------------------------------- -->
      <div class="col-sm-4 col-xs-12 ">
        <v-card class="pa-2" v-if="report && report.links && report.links.levelSeries">
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
      <!-- ------------------------------- -->
      <!-- Links' status distributions   -->
      <!-- ------------------------------- -->
      <div class="col-sm-4 col-xs-12 ">
        <v-card class="pa-2" v-if="report && report.links && report.links.grupSeries">
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
            :series="report.links.grupSeries"
          />
        </v-card>
      </div>
      <!-- ------------------------------- -->
      <!-- Products' position distributions   -->
      <!-- ------------------------------- -->
      <div class="col-sm-4 col-xs-12 ">
        <v-card class="pa-2" v-if="report && report.products && report.products.levelSeries">
          <v-card-title class="pb-2">
            <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
            <div class="col pa-0">
              <div>Product levels</div>
              <div class="caption">The levels of your products.</div>
            </div>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <positions-bar-chart
            :width="300" :height="300"
            :series="report.products.levelSeries" 
          />
        </v-card>
      </div>
    </div>

    <!-- ------------------------------------ -->
    <!-- N Products having the lowest prices -->
    <!-- ------------------------------------ -->
    <v-card class="mt-4" :loading="loading">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-down-circle-outline</v-icon>
        <div>
          <div>Low prices</div>
          <div class="caption">Top 5 products with low prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <table 
        class="pb-2 info-table"
        v-if="report && report.groups && report.groups.extremePrices.LOWEST && report.groups.extremePrices.LOWEST.length">
      >
        <thead>
          <tr>
            <th>Name</th>
            <th width="15%" class="text-right">Price</th>
            <th width="10%" class="text-center">Links</th>
            <th width="15%" class="text-center">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="cursor: pointer"
            link @click="$router.push({ name: 'product', params: { id: row.id } })"
            v-for="(row) in report.products.extremePrices.LOWEST" :key="row.id">
            <td>{{ row.name }} {{ row.description ? '( ' + row.description + ' )' : '' }}</td>
            <td class="text-right">{{ row.price | toPrice }}</td>
            <td class="text-center">{{ row.actives + '/' + row.total }}</td>
            <td class="text-center">
              <ago :date="row.updatedAt" />
            </td>
          </tr>
        </tbody>
      </table>

      <block-message 
        v-else dense
        class="mb-0"
        :message="loading ? 'Loading, please wait...' : 'No data.'"
      />
    </v-card>

    <!-- ------------------------------------- -->
    <!-- N Products having the highest prices -->
    <!-- ------------------------------------- -->
    <v-card class="mt-4" :loading="loading">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-up-circle-outline</v-icon>
        <div>
          <div>High prices</div>
          <div class="caption">Top 5 products with high prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <table 
        class="pb-2 info-table"
        v-if="report && report.groups && report.groups.extremePrices.LOWEST && report.groups.extremePrices.HIGHEST.length">
      >
        <thead>
          <tr>
            <th>Name</th>
            <th width="15%" class="text-right">Price</th>
            <th width="10%" class="text-center">Links</th>
            <th width="15%" class="text-center">Updated</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            style="cursor: pointer"
            link @click="$router.push({ name: 'product', params: { id: row.id } })"
            v-for="(row) in report.products.extremePrices.HIGHEST" :key="row.id">
            <td>{{ row.name }} {{ row.description ? '( ' + row.description + ' )' : '' }}</td>
            <td class="text-right">{{ row.price | toPrice }}</td>
            <td class="text-center">{{ row.actives + '/' + row.total }}</td>
            <td class="text-center">
              <ago :date="row.updatedAt" />
            </td>
          </tr>
        </tbody>
      </table>

      <block-message 
        v-else dense
        class="mb-0"
        :message="loading ? 'Loading, please wait...' : 'No data.'"
      />
    </v-card>

    <!-- ------------------ -->
    <!-- MRU 10 Links -->
    <!-- ------------------ -->
    <v-card class="mt-4" :loading="loading">
      <v-card-title class="pa-2 d-flex">
        <v-icon class="mr-4 hidden-xs-only">mdi-account-search-outline</v-icon>
        <div>
          <div>Links</div>
          <div class="caption">Most recently updated 10 links.</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <table class="list-table" v-if="report && report.links && report.links.mru25.length">
        <tr
          style="cursor: pointer"
          v-for="row in report.links.mru25" :key="row.id" 
          @click="$router.push({ name: 'link', params: { id: row.id } })"
        >
          <td width="3%">
            <v-icon style="font-size: 18px" :color="findLevelColor(row.level)">mdi-star</v-icon>
          </td>

          <td>
            <div class="caption teal--text">{{ row.seller || row.productName }}</div>
            <div class="body-2" :class="{'caption font-italic' : !row.name}">{{ row.name || row.url }}</div>
          </td>

          <td width="12%" class="text-right">
            <div 
              class="caption"
              v-if="!row.price || (row.status != 'ACTIVE' && row.level == 'NA')" 
            >
              NOT YET
            </div>
            <div v-else class="caption" :class="{ 'green--text font-weight-bold': row.level == 'LOWEST', 'red--text font-weight-bold': row.level == 'HIGHEST' }">
              {{ row.level }}
            </div>
            <div class="body-2">{{ row.price | toPrice }}</div>
          </td>
        </tr>
      </table>

      <block-message 
        v-else dense
        class="mb-0"
        :message="loading ? 'Loading, please wait...' : 'No data.'"
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
      loading: false,
      report: {},
      total: {
        product: 0,
        link: 0
      }
    };
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    refresh() {
      this.loading = true;
      DashboardService.refresh().then(result => {
        this.report = result.data;
        if (this.report && this.report.account && this.report.account.subsRenewalAt) {
          this.report.account.daysToRenewal = moment(this.report.account.subsRenewalAt).diff(moment(), 'days')+1;
        }

        if (this.report && this.report.products && this.report.products.positionSeries) {
          let linkCount = 0;
          for (var i = 0; i < this.report.products.positionSeries.length; i++) {
            const dist = this.report.products.positionSeries[i];
            linkCount += dist.count;
          }
          this.total.product = linkCount;

          let compCount = 0;
          if (this.report.links.statusSeries) {
            for (var j = 0; j < this.report.links.statusSeries.length; j++) {
              const comp = this.report.links.statusSeries[j];
              compCount += comp.count;
            }
          }
          this.total.link = compCount;
        }
      }).finally(() => this.loading = false);
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
  td {
    padding: 15px 10px;
  }
</style>