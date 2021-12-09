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
    <v-card class="mt-5" :loading="loading">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-down-circle-outline</v-icon>
        <div>
          <div>Lowest prices</div>
          <div class="caption">Your Top-5 products with the lowest prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <table 
        class="pb-2 info-table"
        v-if="report && report.products && report.products.extremePrices.Lowest && report.products.extremePrices.Lowest.length"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th width="8%" class="text-right">Price</th>
            <th width="8%" class="text-right">Max</th>
            <th width="10%" class="text-left hidden-xs-only">Seller</th>
            <th width="8%" class="text-right hidden-sm-and-down">Avg</th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="cursor: pointer"
            link @click="$router.push({ name: 'product', params: { id: row.id } })"
            v-for="(row) in report.products.extremePrices.Lowest" :key="row.id">
            <td>{{ row.name }}</td>
            <td class="text-right">{{ row.price | toPrice }}</td>
            <td class="text-right">{{ row.maxPrice | toPrice }}</td>
            <td class="text-left hidden-xs-only">{{ row.maxSeller }}</td>
            <td class="text-right hidden-sm-and-down">{{ row.avgPrice | toPrice }}</td>
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
    <v-card class="mt-5" :loading="loading">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-arrow-up-circle-outline</v-icon>
        <div>
          <div>Highest prices</div>
          <div class="caption">Your Top-5 products with the highest prices</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <table 
        class="pb-2 info-table"
        v-if="report && report.products && report.products.extremePrices.Highest && report.products.extremePrices.Highest.length"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th width="8%" class="text-right">Price</th>
            <th width="8%" class="text-right">Min</th>
            <th width="10%" class="text-left hidden-xs-only">Seller</th>
            <th width="8%" class="text-right hidden-sm-and-down">Avg</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            style="cursor: pointer"
            link @click="$router.push({ name: 'product', params: { id: row.id } })"
            v-for="(row) in report.products.extremePrices.Highest" :key="row.id">
            <td>{{ row.name }}</td>
            <td class="text-right">{{ row.price | toPrice }}</td>
            <td class="text-right">{{ row.minPrice | toPrice }}</td>
            <td class="text-left hidden-xs-only">{{ row.minSeller }}</td>
            <td class="text-right hidden-sm-and-down">{{ row.avgPrice | toPrice }}</td>
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
    <!-- Link status distribution by platform  -->
    <!-- ------------------------------------- -->
    <v-card class="mt-5" :loading="loading">
      <v-card-title class="pa-2">
        <v-icon class="mr-4 hidden-xs-only">mdi-chart-arc</v-icon>
        <div>
          <div>Platform Statuses</div>
          <div class="caption">Link status distribution by platform</div>
        </div>
      </v-card-title>
      <v-divider></v-divider>

      <div 
        style="max-height: 300px; overflow: auto"
        v-if="report && report.platformStatusDist && report.platformStatusDist.length"
      >
        <table class="pb-2 info-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th width="10%" class="text-right">Active</th>
              <th width="10%" class="text-right hidden-sm-and-down">Waiting</th>
              <th width="10%" class="text-right hidden-xs-only">Trying</th>
              <th width="10%" class="text-right">Problem</th>
              <th width="10%" class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row) in report.platformStatusDist" :key="row.domain">
              <td>{{ row.domain }}</td>
              <td class="text-right">{{ row.actives }}</td>
              <td class="text-right hidden-sm-and-down">{{ row.waitings }}</td>
              <td class="text-right hidden-xs-only">{{ row.tryings }}</td>
              <td class="text-right">{{ row.problems }}</td>
              <td class="text-right">{{ row.total }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <block-message 
        v-else dense
        class="mb-0"
        :message="loading ? 'Loading, please wait...' : 'No data.'"
      />
    </v-card>

    <!-- ------------------ -->
    <!-- MRU 25 Links -->
    <!-- ------------------ -->
    <v-card class="mt-5" :loading="loading">
      <v-card-title class="pa-2 d-flex">
        <v-icon class="mr-4 hidden-xs-only">mdi-account-search-outline</v-icon>
        <div>
          <div>Links</div>
          <div class="caption">Most recently updated 25 links.</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <table class="list-table" v-if="report && report.links && report.links.mru25.length">
        <thead>
          <tr>
            <th>Competitor</th>
            <th width="12%">Updated</th>
            <th width="12%" class="text-right">Price</th>
            <th width="4%"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            style="cursor: pointer"
            v-for="row in report.links.mru25" :key="row.id" 
            @click="$router.push({ name: 'link', params: { id: row.id } })"
          >
            <td>
              <div class="d-flex">
                <v-icon 
                  class="hidden-xs-only mr-1"
                  style="font-size:18px"
                  :color="row.alarmId ? 'pink' : '#ddd'" 
                  :title="row.alarmId ? `Alarming when ${row.alarmName}` : 'NotSet'" 
                >
                  mdi-bell
                </v-icon>
                <div>
                  <div class="caption teal--text">{{ row.seller }}</div>
                  <div class="body-2" :class="{'caption font-italic' : !row.name}">{{ row.name || row.url }}</div>
                </div>
              </div>
            </td>

            <td class="hidden-sm-and-down">
              <ago class="caption" :date="row.updatedAt || row.checkedAt" />
            </td>

            <td class="text-center">
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
              </div>
            </td>

            <td class="text-center pl-0">
              <v-menu offset-y bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small icon
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item link @click="copyTheLink(row.url)">
                    <v-list-item-title>COPY URL</v-list-item-title>
                  </v-list-item>
                  <v-list-item link @click="$router.push({ name: 'link', params: { id: row.id } })">
                    <v-list-item-title>OPEN LINK</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link @click="$router.push({ name: 'product', params: { id: row.productId } })">
                    <v-list-item-title>OPEN PRODUCT</v-list-item-title>
                  </v-list-item>
                  <v-list-item link target="_blank" :href="row.url">
                    <v-list-item-title>OPEN WEBPAGE</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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
    copyTheLink(url) {
      this.copyToClipboard(url);
      this.$store.commit('snackbar/setMessage', { text: 'Url copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
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