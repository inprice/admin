<template>
  <div>
    <div class="d-flex">
      <span class="display-1">Dashboard</span>

      <v-spacer></v-spacer>

      <div class="text-right mt-4">
        <span class="caption mr-2">{{ report.date }}</span>
        <v-btn small @click="refresh">
          <v-icon left>mdi-refresh</v-icon> Refresh
        </v-btn>
      </div>
    </div>

    <v-alert
      class="mt-5 row" 
      v-if="!!report || !!report.company || !!report.company.planId"
      color="red" border="left" elevation="2" colored-border type="warning">
      The indicators below will be full of data after you have a plan and competitors!
    </v-alert>

    <v-row>
      <!-- ------------------------------- -->
      <!-- Products position statuses -->
      <!-- ------------------------------- -->
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-layers</v-icon>
          <div class="col pa-0">
            <div>Product positions</div>
            <div class="caption float-left">The positions of your products.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <positions-bar-chart 
          :width="300" :height="300"
          :series="report.products.positionDists" 
          v-if="report && report.products && report.products.positionDists.length"
        />
        <div v-else class="ml-2 mt-3">
          No data
        </div>
      </v-card>

      <!-- -------------------------------- -->
      <!-- Competitors status distributions -->
      <!-- -------------------------------- -->
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-layers-outline</v-icon>
          <div class="col pa-0">
            <div>Competitor statuses</div>
            <div class="caption float-left">The statuses of your competitors.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <statuses-pie-chart
          :width="300" :height="300"
          :series="report.competitors.statusDists" 
          v-if="report && report.competitors && report.competitors.statusDists.length"
        />
        <div v-else class="ml-2 mt-3">
          No data
        </div>
      </v-card>
    </v-row>

    <v-row>
      <!-- ------------------ -->
      <!-- MRU 25 Competitors -->
      <!-- ------------------ -->
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-account-search-outline</v-icon>
          <div class="col pa-0">
            <div>Competitors</div>
            <div class="caption float-left">The list of most recently updated 25 competitors.</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-simple-table dense v-if="report && report.competitors && report.competitors.mru25.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="20%">Competitor</th>
                <th>Product</th>
                <th width="10%" class="text-right">Price</th>
                <th width="20%">Status</th>
                <th width="15%">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in report.competitors.mru25" :key="index">
                <td width="20%">{{ row.seller }}</td>
                <td>{{ row.productName }}</td>
                <td width="10%" class="text-right font-weight-bold">{{ row.price | toPrice }}</td>
                <td width="20%">{{ row.status | formatStatus }}</td>
                <td width="15%">{{ row.lastUpdate | formatDate }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else class="ml-2 mt-3">
          No data
        </div>
      </v-card>

    </v-row>

    <v-row>
      <!-- ------------------------------------ -->
      <!-- 10 Products having the lowest prices -->
      <!-- ------------------------------------ -->
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-arrow-down-circle-outline</v-icon>
          <div class="col pa-0">
            <div>10 products with low prices</div>
            <div class="caption float-left">The list of 10 products having the lowest prices among their competitors.</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-simple-table dense v-if="report && report.products && report.products.extremePrices.lowest">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="20%">Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">Competitors</th>
                <th class="text-right">Ranking</th>
                <th class="text-center">Date</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row) in report.products.extremePrices.lowest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="text-right">{{ row.competitors || 0 }}</td>
                <td class="text-right">{{ row.ranking || 1 }}</td>
                <td class="text-center">{{ row.lastUpdate | formatDate }}</td>
                <td class="text-center"><v-btn small class="ma-1">Edit</v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else class="ml-2 mt-3">
          No data
        </div>
      </v-card>
    </v-row>

    <!-- ------------------------------------- -->
    <!-- 10 Products having the highest prices -->
    <!-- ------------------------------------- -->
    <v-row>
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-arrow-up-circle-outline</v-icon>
          <div class="col pa-0">
            <div>10 Products with high prices</div>
            <div class="caption float-left">The list of 10 products having the highest prices among their competitors.</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-simple-table dense v-if="report && report.products && report.products.extremePrices.highest">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="20%">Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">Competitors</th>
                <th class="text-right">Ranking</th>
                <th class="text-center">Date</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row) in report.products.extremePrices.highest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="text-right">{{ row.competitors || 0 }}</td>
                <td class="text-right">{{ row.ranking || 1 }}</td>
                <td class="text-center">{{ row.lastUpdate | formatDate }}</td>
                <td class="text-center"><v-btn small class="ma-1">Edit</v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div v-else class="ml-2 mt-3">
          No data
        </div>
      </v-card>
    </v-row>

  </div>
</template>

<script>
import DashboardService from '@/service/dashboard';

export default {
  data() {
    return {
      report: {},
      total: {
        product: 0,
        competitor: 0
      }
    };
  },
  methods: {
    async refresh() {
      const result = await DashboardService.refresh();
      this.report = result.data;

      if (this.report && this.report.products && this.report.products.positionDists) {
        let prodCount = 0;
        for (var i = 0; i < this.report.products.positionDists.length; i++) {
          const dist = this.report.products.positionDists[i];
          prodCount += dist.count;
        }
        this.total.product = prodCount;

        let compCount = 0;
        for (var j = 0; j < this.report.competitors.statusDists.length; j++) {
          const comp = this.report.competitors.statusDists[j];
          compCount += comp.count;
        }
        this.total.competitor = compCount;
      }
    },  
  },
  mounted() {
    this.refresh();
  },
  components: {
    PositionsBarChart: () => import('./PositionsBarChart.js'),
    StatusesPieChart: () => import('./StatusesPieChart.js'),
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
    margin-top: 1rem;
  }
  .linear-table tr td {
    border-bottom: none !important;
  }
  .circular-table tr td {
    padding: 4px 0;
    border-bottom: none !important;
  }
</style>
