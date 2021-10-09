<template>
  <div v-if="report">

    <status-alert></status-alert>

    <div class="d-flex">
      <div>
        <div class="title">Dashboard</div>
        <div class="body-2">An overall information of your current status.</div>
      </div>

      <v-spacer></v-spacer>

      <div class="text-center my-auto" v-if="report.workspace && CURSTAT.isActive">
        <v-btn small color="white" @click="refresh">
          Refresh
        </v-btn>
      </div>
    </div>

    <v-divider class="my-2"></v-divider>

    <div class="row justify-space-around">
      <!-- ------------------------------- -->
      <!-- Products' position distributions   -->
      <!-- ------------------------------- -->
      <div class="col-sm-4 col-xs-12 ">
        <v-card class="pa-2" v-if="report && report.products && report.products.positionSeries">
          <v-card-title class="pb-2">
            <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
            <div class="col pa-0">
              <div>Product positions</div>
              <div class="caption">The positions of your products.</div>
            </div>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <positions-bar-chart
            :width="300" :height="300"
            :series="report.products.positionSeries" 
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
          <statuses-pie-chart
            :width="300" :height="300"
            :series="report.links.grupSeries"
          />
        </v-card>
      </div>
      <!-- ------------------------------- -->
      <!-- Links' position distributions   -->
      <!-- ------------------------------- -->
      <div class="col-sm-4 col-xs-12 ">
        <v-card class="pa-2" v-if="report && report.links && report.links.positionSeries">
          <v-card-title class="pb-2">
            <v-icon class="mr-4 hidden-xs-only">mdi-layers</v-icon>
            <div class="col pa-0">
              <div>Link positions</div>
              <div class="caption">The positions of your links.</div>
            </div>
          </v-card-title>
          <v-divider class="mb-2"></v-divider>
          <positions-bar-chart
            :width="300" :height="300"
            :series="report.links.positionSeries" 
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
        v-if="report && report.products && report.products.extremePrices.LOWEST && report.products.extremePrices.LOWEST.length"
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
            <td>{{ row.name }} {{ row.sku ? '( ' + row.sku + ' )' : '' }}</td>
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
        v-if="report && report.products && report.products.extremePrices.LOWEST && report.products.extremePrices.HIGHEST.length"
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
            <td>{{ row.name }} {{ row.sku ? '( ' + row.sku + ' )' : '' }}</td>
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
          <td>
            <div class="caption teal--text font-weight-medium">{{ row.seller }}</div>
            <div class="body-2" :class="{'caption font-italic' : !row.name}">{{ row.name || row.url }}</div>
          </td>

          <td width="12%" class="align-center">
            <div class="text-right d-flex justify-end my-auto">
              <div class="mr-1">
                <div 
                  v-if="row.price"
                  class="caption font-weight-medium" 
                  :style="'color: ' + findPositionColor(row.position)"
                >
                  {{ row.position }}
                </div>
                <div>{{ row.price | toPrice }}</div>
              </div>
              <v-icon 
                class="hidden-xs-only"
                :color="row.alarmId ? '' : 'transparent'" 
                style="font-size:20px"
              >
                mdi-alarm
              </v-icon>
            </div>
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
        if (this.report && this.report.workspace && this.report.workspace.subsRenewalAt) {
          this.report.workspace.daysToRenewal = moment(this.report.workspace.subsRenewalAt).diff(moment(), 'days')+1;
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
    StatusesPieChart: () => import('./StatusesPieChart.js'),
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