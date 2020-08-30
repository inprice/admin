<template>
  <div>

    <div v-if="prodId">

      <div class="mt-4 subtitle text-uppercase">
        Comptetitors
      </div>
      
      <v-text-field 
        v-model="url"
        append-icon="mdi-plus"
        @click:append="addUrl"
        @keyup.enter.native="addUrl"
        dense solo light
        class="col-8 my-2"
        maxlength="1024"
        hide-details
        placeholder="Paste here the exact product page URL of your competitor and press Enter"
      />
      <span v-if="addProblem" class="caption">{{ addProblem }}</span>
      
      <div v-if="rows && rows.length > 0">

        <v-expansion-panels accordion hover>
          <v-expansion-panel v-for="row in rows" :key="row.id">
            <v-expansion-panel-header>
              <div class="col pa-0">
                {{ row.seller || 'NA' }}
              </div>
              <div class="col pa-0">
                {{ row.price | toPrice }}
              </div>
              <div class="col pa-0">
                {{ row.status || 'NA' }}
              </div>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
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

              <div class="d-flex pa-2" v-if="$store.get('auth/IS_EDITOR')">
                <v-spacer></v-spacer>
                <v-btn class="mx-1" small @click="changeStatus(row.id, 'RENEW')" v-if="isSuitable(row.status, 'TOBE_RENEWED')">Renew</v-btn>
                <v-btn class="mx-1" small @click="changeStatus(row.id, 'PAUSE')" v-if="isSuitable(row.status, 'PAUSED')">Pause</v-btn>
                <v-btn class="mx-1" small @click="changeStatus(row.id, 'RESUME')" v-if="isSuitable(row.status, 'RESUME')">Resume</v-btn>
                <v-btn class="mx-1" small dark color="red" @click="remove(row.id, (row.name || row.url))">Delete</v-btn>
              </div>

            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>

      </div>

      <p v-else class="mt-5">
        No competitor found! You can add a new one.
      </p>

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
  props: ["prodId", "rows"],
  data() {
    return {
      url: '',
      loading: false,
      selecteStatus: null,
      allStatuses: [],
      addProblem: null,
    }
  },
  methods: {
    async addNew() {
      this.addProblem = null;
      if (Utility.verifyURL(this.url)) {
        this.loading = true;
        const result = await CompetitorService.insert({ url: this.url, productId: this.prodId });
        if (result == true) {
          this.close();
          this.$emit('saved');
          console.log('Saklandi', result);
        }
        this.loading = false;
      } else {
        this.addProblem = 'Invalid URL!';
      }
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
    async refreshCompetitors() {
      if (this.prod_id) {
        const result = await CompetitorService.list(this.prod_id);
        if (result) {
          this.product = result.product;
          this.rows = result.competitors;

          const map = {};
          this.rows.forEach((row) => {
            map[row.status] = (map[row.status] || 0) + 1;
          });

          let count = 0;
          this.allStatuses = [];
          Object.keys(map).forEach((key) => {
            const text = key.replace('_', ' ') + ` (${map[key]})`;
            this.allStatuses.push({ value: key, text });
            count += map[key];
          });
          this.selectedStatus = null;
          this.allStatuses.unshift({ value: null, text: `ALL (${count})` });
          return;
        }
      }
      this.rows = [];
      this.product = {};
    },
    addUrl() {
      if (this.$store.get('auth/IS_JUST_VIEWER') == false) {
        console.log('Hakkı var', this.url);
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
  components: {
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
  .v-expansion-panel-header--active {
    background-color: rgba(200, 200, 200, 0.3);
  }
</style>
