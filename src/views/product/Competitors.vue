<template>
  <div>

    <div class="mt-4 mb-2" v-if="product">
      <v-row class="mx-1 mb-2">
        <div>
          <div class="caption text-uppercase">
            PRODUCT
          </div>
          <div class="headline">
            {{ product.name }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <div>
        <br>
        <div class="title text-right">{{ product.price | toCurrency }}</div>
        </div>
      </v-row>

      <v-divider></v-divider>

      <div class="mt-6 caption text-uppercase">
        COMPETITORS
      </div>
      <v-row class="mb-2">
        <v-col>
          <v-select
            dense outlined
            hide-details
            v-model="status"
            :items="statuses"
            :menu-props="{ auto: true, overflowY: true }"
            @change="filter"
          />
        </v-col>
        <v-col>
          <div class="text-right">
            <v-btn dark color="success" @click="addNew" :disabled="$store.get('auth/IS_JUST_VIEWER')">Add New Competitor</v-btn>
          </div>
        </v-col>
      </v-row>

      <div v-if="rows && rows.length > 0">

        <v-card v-for="row in filtered" :key="row.id" class="py-0 mb-4 pb-1">
          <v-card-title class="pt-2 pb-1">
            {{ row.name || 'NA' }}
          
            <v-spacer></v-spacer>

            <v-menu offset-y left v-if="$store.get('auth/IS_EDITOR')">
              <template v-slot:activator="{ on }">
                <v-btn small icon v-on="on">
                  <v-icon dark>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>

                <v-list-item @click="changeStatus(row.id, 'RENEW')" v-if="isSuitable(row.status, 'TOBE_RENEWED')">
                  <v-list-item-title>RENEW</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeStatus(row.id, 'PAUSE')" v-if="isSuitable(row.status, 'PAUSED')">
                  <v-list-item-title>PAUSE</v-list-item-title>
                </v-list-item>
                <v-list-item @click="changeStatus(row.id, 'RESUME')" v-if="isSuitable(row.status, 'RESUMED')">
                  <v-list-item-title>RESUME</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="remove(row.id, (row.name || row.url))">
                  <v-list-item-title>DELETE</v-list-item-title>
                </v-list-item>

              </v-list>
            </v-menu>
          </v-card-title>

          <v-simple-table dense class="ma-2 mb-1 bordered">
            <template v-slot:default>
              <tbody>
                <tr>
                  <th>Price</th>
                  <td>{{ row.price | toCurrency }}</td>
                  <th>Status</th>
                  <td>{{ row.status }}</td>
                </tr>
                <tr>
                  <th>Last Check</th>
                  <td>{{ row.lastCheck | formatDate }}</td>
                  <th>Seller</th>
                  <td>{{ row.seller || 'NA' }}</td>
                </tr>
                <tr>
                  <th>Last Update</th>
                  <td>{{ row.lastUpdate | formatDate }}</td>
                  <th>Platform</th>
                  <td>{{ row.platform || 'NA' }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <div class="row">
            <div class="col text-truncate mx-2 caption py-1">
              <v-icon small>mdi-link-variant</v-icon> <a :href="row.url" target="_blank">{{ row.url }}</a>
            </div>
          </div>

        </v-card>
      </div>

      <p v-else class="mt-5">
        No competitor found! You can add a new one.
      </p>

      <AddCompetitor ref="addCompetitorDialog" @saved="refreshCompetitors" />
      <confirm ref="confirm"></confirm>
    </div>

    <div v-else>
      Invalid product!
    </div>
  </div>

</template>

<script>
import CompetitorService from '@/service/competitor';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      product: {},
      prod_id: 0,
      status: null,
      rows: [],
      filtered: [],
      statuses: [],
    }
  },
  methods: {
    addNew() {
      this.$refs.addCompetitorDialog.open(this.prod_id);
    },
    async changeStatus(id, status) {
      const result = await CompetitorService.changeStatus(id, status);
      if (result == true) this.refreshCompetitors();
    },
    remove(id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await CompetitorService.remove(id);
          if (result == true) {
            this.refreshCompetitors();
          }
        }
      });
    },
    copyUrl(text) {
      var input = document.createElement('textarea');
      input.innerHTML = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    },
    async refreshCompetitors() {
      if (this.prod_id) {
        const result = await CompetitorService.list(this.prod_id);
        if (result) {
          this.product = result.product;
          this.rows = result.competitors;
          this.filtered = this.rows;

          const map = {};
          this.rows.forEach((row) => {
            map[row.status] = (map[row.status] || 0) + 1;
          });

          let count = 0;
          this.statuses = [];
          Object.keys(map).forEach((key) => {
            const text = key.replace('_', ' ') + ` (${map[key]})`;
            this.statuses.push({ value: key, text });
            count += map[key];
          });
          this.status = null;
          this.statuses.unshift({ value: null, text: `ALL (${count})` });
          return;
        }
      }
      this.rows = [];
      this.product = {};
    },
    filter() {
      if (this.status) {
        this.filtered = this.rows.filter(row => {
          return row.status == this.status;
        });
      } else {
        this.filtered = this.rows;
      }
    },
    isSuitable(current, target) {
      switch (current) {
        case 'AVAILABLE':
          return (target == 'TOBE_RENEWED' || target == 'PAUSED');
        case 'PAUSED':
          return (target == 'RESUMED');
        case 'TOBE_CLASSIFIED':
        case 'TOBE_IMPLEMENTED':
        case 'IMPLEMENTED':
        case 'NOT_AVAILABLE':
        case 'READ_ERROR':
        case 'SOCKET_ERROR':
        case 'NETWORK_ERROR':
        case 'CLASS_PROBLEM':
        case 'INTERNAL_ERROR':
          return (target == 'PAUSED');
        default:
          return false;
      }
    }
  },
  mounted() {
    Utility.doubleRaf(() => {
      const urlParts = window.location.pathname.split('/');
      if (urlParts && urlParts.length) {
        const id = urlParts[urlParts.length-1];
        if (!isNaN(+id)) {
          this.prod_id = id;
          this.refreshCompetitors();
        }
      }
    });
  },
  components: {
    AddCompetitor: () => import('./AddCompetitor'),
    confirm: () => import('@/component/Confirm.vue')
  }
};
</script>

<style scoped>
  .bordered {
    border: 1px solid #ddd;
  }
  th {
    width: 10%;
    background-color: #eee;
  }
  tr:hover {
    background: #fff !important;
  }
  .v-data-table td, .v-data-table th {
    padding: 0 8px;
  }
</style>
