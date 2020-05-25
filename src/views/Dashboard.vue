<template>
  <div>
    <div class="d-flex">
      <span class="display-1 mb-2">Welcome {{ username }}</span>
      <v-spacer></v-spacer>
      <div class="text-right">
        <span class="caption mr-2">{{ report.date }}</span>
        <v-btn
          small fab dark
          elevation="2"
          color="info"
          @click="refresh">
          <v-icon dark>mdi-refresh</v-icon>
        </v-btn>
      </div>
    </div>

    <v-row>
      <v-card class="col" v-for="(entity, index) in firstRow" :key="index">
        <div class="d-flex mb-1">
          <v-icon style="font-size: 60px;" class="mt-1" :color="entity.color">mdi-{{ entity.icon }}</v-icon>
          <v-spacer></v-spacer>
          <div class="mr-2">
            <div class="text-uppercase text-right">{{ entity.title }}</div>
            <div class="display-2 text-right">{{ entity.number }}</div>
          </div>
        </div>
        <v-divider class="mb-2"></v-divider>
        <span class="caption">{{ entity.desc }}</span>
      </v-card>
    </v-row>

    <v-row>
      <v-card class="col" v-for="(entity, index) in secondRow" :key="index">
        <div class="d-flex mb-1">
          <v-icon style="font-size: 60px;" class="mt-1" :color="entity.color">mdi-{{ entity.icon }}</v-icon>
          <v-spacer></v-spacer>
          <div class="mr-2">
            <div class="text-uppercase text-right">{{ entity.title }}</div>
            <div class="display-2 text-right">{{ entity.number }}</div>
          </div>
        </div>
        <v-divider class="mb-2"></v-divider>
        <span class="caption">{{ entity.desc }}</span>
      </v-card>

      <v-card class="col">
        <div class="d-flex mb-1">
          <v-icon style="font-size: 60px;" class="mt-1" color="orange">mdi-warehouse</v-icon>
          <v-spacer></v-spacer>
          <div class="mr-2" v-if="report.company">
            <table class="caption mt-1">
              <tr>
                <th class="text-right">Name</th>
                <td>:</td>
                <td>{{ report.company.name }}</td>
              </tr>
              <tr>
                <th class="text-right">Products</th>
                <td>:</td>
                <td>{{ report.company.rowLimit }}</td>
              </tr>
              <tr>
                <th class="text-right">Plan</th>
                <td>:</td>
                <td>{{ report.company.planName }}</td>
              </tr>
            </table>
          </div>
        </div>
        <v-divider class="mb-2"></v-divider>
        <span class="caption">Company info</span>
      </v-card>
    </v-row>

    <v-row>
      <v-card class="col">
        <v-card-title class="pa-0">Product Positions</v-card-title>
        <apexchart ref="prodDistro" type="donut" height="300" :options="prodDistro.options" :series="prodDistro.series"></apexchart>
      </v-card>

      <v-card class="col">
        <apexchart ref="linkDistro" type="bar" height="300" :options="chartOptions" :series="series"></apexchart>
      </v-card>
    </v-row>

    <v-row>
      <v-card class="col">
        <v-card-title class="pa-0">Most Recently Updated Products</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th class="text-right">Price</th>
                <th class="text-right">Min Price</th>
                <th class="hidden-sm-and-down text-right">Avg Price</th>
                <th class="text-right">Max Price</th>
                <th class="hidden-sm-and-down">Date</th>
              </tr>
            </thead>
            <tbody v-if="report.products">
              <tr v-for="row in report.products.mru10" :key="row.code">
                <td>{{ row.name }}</td>
                <td>{{ row.position | toPosition }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="text-right">{{ row.minPrice | toCurrency }}</td>
                <td class="hidden-sm-and-down text-right">{{ row.avgPrice | toCurrency }}</td>
                <td class="text-right">{{ row.maxPrice | toCurrency }}</td>
                <td class="hidden-sm-and-down">{{ row.lastUpdate | formatDate }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-row>

    <v-row>
      <v-card class="col">
        <v-card-title class="pa-0">Most Recently Updated Links</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Product</th>
                <th class="hidden-sm-and-down">Platform</th>
                <th>Seller</th>
                <th class="text-right">Price</th>
                <th class="hidden-sm-and-down">Status</th>
                <th class="hidden-sm-and-down">Date</th>
              </tr>
            </thead>
            <tbody v-if="report.links">
              <tr v-for="row in report.links.mru10" :key="row.sku">
                <td>{{ row.productName }}</td>
                <td>{{ row.platform }}</td>
                <td class="hidden-sm-and-down">{{ row.seller }}</td>
                <td class="text-right">{{ row.price | toCurrency }}</td>
                <td class="hidden-sm-and-down">{{ row.status }}</td>
                <td class="hidden-sm-and-down">{{ row.lastUpdate | formatDate }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-row>

  </div>
</template>

<script>
import { get } from 'vuex-pathify'
import DashboardService from '@/service/dashboard';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      report: {},
      firstRow: [],
      secondRow: [],
      prodDistro: {
        options: {},
        series: [],
      },
      series: [{
        data: [0, 0, 0, 0, 0, 0, 0, 0]
      }],
      chartOptions: {
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              enabled: false
            },
          }
        },
        colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['white']
          },
          offsetX: 0,
          dropShadow: {
            enabled: true
          }
        },
        xaxis: {
          categories: ['NEW', 'AVAILABLE', 'NOT AVAILABLE', 'PAUSED', 
            'IMPLEMENTED', 'BE IMPLEMENTED', 'WONT BE IMPLEMENTED', 'OTHER'
          ]
        },
        title: {
          text: 'Link Statuses',
          style: {
            fontSize: '20px'
          },
        },
        tooltip: {
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            title: {
              formatter: function () {
                return ''
              }
            }
          }
        }
      },

    };
  },
  computed: {
    username: get('auth/session@user'),
  },
  methods: {
    async refresh() {
      const report = await DashboardService.refresh();
      this.setReport(report);
    },
    setReport(report) {
      if (report && report.status == true) {
        this.report = report.data;
        this.firstRow = [
          { title: 'Active Products', desc: 'Acitvely monitored products', icon:'database', color: 'success', number: this.report.products.count.active },
          { title: 'The cheapest', desc: 'Product count having the cheapest price', icon:'sort-reverse-variant', color: 'purple', number: this.report.products.edgeOfYou.min },
          { title: 'The most expensive', desc: 'Product count having the most expensive price', icon:'sort-variant', color: 'red', number: this.report.products.edgeOfYou.max },
        ];

        this.secondRow = [
          { title: 'Links', desc: 'Total links count of your products', icon:'link-variant', color: 'info', number: this.report.links.count },
          { title: 'Passive Products', desc: 'Passviated products', icon:'database', color: 'gray', number: this.report.products.count.passive },
        ];

        this.$refs.prodDistro.updateOptions({
          labels: this.report.products.distribution.labels,
          series: this.report.products.distribution.series
        });

        this.$refs.linkDistro.updateSeries([{
          data: this.report.links.distribution.series
        }], false, true);
      }
    }
  },
  mounted() {
    Utility.doubleRaf(async () => {
      const report = await DashboardService.getReport();
      this.setReport(report);
    });
  }
};
</script>

<style scoped>
  .row > .v-card {
    margin: 5px;
    min-width: 250px;
  }
  tr > td {
    padding: 0 3px;
  }
</style>