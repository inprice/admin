<template>
  <div v-if="report">
    <div class="d-flex mt-2 pl-1">
      <span class="title">Dashboard</span>

      <v-spacer></v-spacer>

      <div class="text-right" v-if="hasAnActiveStatus">
        <span class="caption mr-2">{{ report.date }}</span>
        <v-btn small color="success" @click="refresh">
          <v-icon left>mdi-refresh</v-icon> Refresh
        </v-btn>
      </div>
    </div>

    <v-alert
      class="mb-0 mt-2" 
      color="orange" border="left" elevation="2" colored-border type="warning"
      >
        <div class="d-flex justify-space-between" v-if="! hasAnActiveStatus && ! isStopped">
          <div>
            Seem that you have no active plan!
            <span v-if="hasFreeUseRight">You can start your 30 days free trial period.</span>
            <div>You can choose a plan that best suits your needs.</div>
          </div>
          <v-btn 
            small
            class="ml-3 my-auto"
            @click="$router.push( { name: 'plans' })">
              Please click here
          </v-btn>
        </div>
        <div v-if="isStopped">
          Your account has been stopped!
          <div>If you think there is a problem, please contact us with an email <strong>support@inprice.io</strong></div>
        </div>
        <FreePlanTexts v-if="isInTrialPeriod" :daysToRenewal="report.company.daysToRenewal" :subsRenewalAt="report.company.subsRenewalAt" />
    </v-alert>

    <v-row>
      <!-- ------------------------------- -->
      <!-- Products position statuses -->
      <!-- ------------------------------- -->
      <v-card class="col" v-if="report && report.products && report.products.positionDists">
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
        />
      </v-card>

      <!-- -------------------------------- -->
      <!-- Links status distributions -->
      <!-- -------------------------------- -->
      <v-card class="col" v-if="report && report.links && report.links.statusDists">
        <v-card-title>
          <v-icon class="mr-4">mdi-layers-outline</v-icon>
          <div class="col pa-0">
            <div>Link statuses</div>
            <div class="caption float-left">The statuses of your competitors.</div>
          </div>
        </v-card-title>
        <v-divider class="mb-2"></v-divider>
        <statuses-pie-chart
          :width="300" :height="300"
          :series="report.links.statusDists" 
        />
      </v-card>
    </v-row>

    <v-row>
      <!-- ------------------ -->
      <!-- MRU 25 Links -->
      <!-- ------------------ -->
      <v-card class="col">
        <v-card-title>
          <v-icon class="mr-4">mdi-account-search-outline</v-icon>
          <div class="col pa-0">
            <div>Links</div>
            <div class="caption float-left">The list of Most Recently Updated 25 competitors.</div>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-simple-table dense v-if="report && report.links && report.links.mru25.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Seller & Platform | URL</th>
                <th width="10%" class="text-right">Price</th>
                <th width="20%">Status</th>
                <th width="15%">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in report.links.mru25" :key="index" :title="row.productName">
                <td v-if="row.seller">{{ (row.seller || 'NA') + (' ('+row.platform+')' || '') }}</td>
                <td v-else class="caption font-italic">{{ row.url }}</td>
                <td width="10%" class="text-right font-weight-bold">{{ row.price | toPrice }}</td>
                <td width="20%">{{ row.status | formatStatus }}</td>
                <td width="15%">
                  <ago :date="row.lastUpdate" />
                </td>
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
        <v-simple-table dense v-if="report && report.products && report.products.extremePrices.lowest && report.products.extremePrices.lowest.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="20%">Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">Links</th>
                <th class="text-right">Ranking</th>
                <th class="text-center">Date</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row) in report.products.extremePrices.lowest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="text-right">{{ row.links || 0 }}</td>
                <td class="text-right">{{ row.ranking || 1 }}</td>
                <td class="text-center">
                  <ago :date="row.lastUpdate" />
                </td>
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
        <v-simple-table dense v-if="report && report.products && report.products.extremePrices.highest && report.products.extremePrices.highest.length">
          <template v-slot:default>
            <thead>
              <tr>
                <th width="20%">Name</th>
                <th class="text-right">Price</th>
                <th class="text-right">Links</th>
                <th class="text-right">Ranking</th>
                <th class="text-center">Date</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row) in report.products.extremePrices.highest" :key="row.id">
                <td>{{ row.name }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="text-right">{{ row.links || 0 }}</td>
                <td class="text-right">{{ row.ranking || 1 }}</td>
                <td class="text-center">
                  <ago :date="row.lastUpdate" />
                </td>
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
import moment from 'moment-timezone';

const ACTIVE_STATUSES = [ 'FREE', 'COUPONED', 'SUBSCRIBED' ];

export default {
  data() {
    return {
      report: {},
      total: {
        product: 0,
        link: 0
      }
    };
  },
  computed: {
    hasAnActiveStatus() {
      console.log('--', this.report);
      if (this.report.company && this.report.company.subsStatus) {
        if (ACTIVE_STATUSES.includes(this.report.company.subsStatus)) {
          return (this.report.company.daysToRenewal !== undefined && this.report.company.daysToRenewal >= 0);
        }
      }
      return false;
    },
    hasFreeUseRight() {
      if (this.report.company && this.report.company.subsStatus) {
        return (this.report.company.subsStatus == 'NOT_SET');
      }
      return false;
    },
    isStopped() {
      if (this.report.company && this.report.company.subsStatus) {
        return (this.report.company.subsStatus == 'STOPPED');
      }
      return false;
    },
    isInTrialPeriod() {
      return (this.report.company && this.report.company.subsStatus && this.report.company.subsStatus == 'FREE');
    },
  },
  methods: {
    async refresh() {
      const result = await DashboardService.refresh();
      this.report = result.data;
      if (this.report.company.subsRenewalAt) {
        this.report.company.daysToRenewal = moment(this.report.company.subsRenewalAt).diff(moment(), 'days')+1;
      }

      if (this.report && this.report.products && this.report.products.positionDists) {
        let prodCount = 0;
        for (var i = 0; i < this.report.products.positionDists.length; i++) {
          const dist = this.report.products.positionDists[i];
          prodCount += dist.count;
        }
        this.total.product = prodCount;

        let compCount = 0;
        for (var j = 0; j < this.report.links.statusDists.length; j++) {
          const comp = this.report.links.statusDists[j];
          compCount += comp.count;
        }
        this.total.link = compCount;
      }
    },  
  },
  mounted() {
    this.refresh();
  },
  components: {
    PositionsBarChart: () => import('./PositionsBarChart.js'),
    StatusesPieChart: () => import('./StatusesPieChart.js'),
    FreePlanTexts: () => import('@/component/app/FreePlanTexts.vue'),
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
