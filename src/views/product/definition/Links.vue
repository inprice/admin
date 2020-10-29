<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-multiple</v-icon>
        <div>
          <div>Links</div>
          <div class="caption">The url list of your competitors' product pages.</div>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="prodId">
        <v-btn 
          dark small
          v-if="!showAddNewBar"
          color="success"
          class="ma-4"
          @click="openAddNewBar">
            <v-icon>mdi-plus</v-icon>Add new Url
        </v-btn>

        <v-form ref="addNewForm" v-model="isUrlValid" @submit.prevent>
          <v-scroll-x-transition leave-absolute>
            <div v-if="showAddNewBar" class="d-flex">
              <v-text-field 
                autofocus
                v-model="url"
                :rules="rules.url"
                @keyup.enter.native="addNew"
                @keyup.esc.native="clearAddNewBar(true)"
                dense solo light
                class="col-10 pl-4 pt-4"
                maxlength="1024"
                placeholder="Add URL">
                  <template slot="append">
                    <v-icon class="mr-2" @click="addNew">mdi-check</v-icon>
                    <v-icon  @click="clearAddNewBar(true)">mdi-window-close</v-icon>
                  </template>          
              </v-text-field>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon style="margin-left: 7px; margin-top: -7px" v-on="on" v-bind="attrs">mdi-help-circle-outline</v-icon>
                </template>
                Please keep in mind
                <ul class="caption">
                  <li>URL must be the exact address of your link's product page.</li>
                  <li>At least, Code, Name and Price fields should be displayed on it.</li>
                  <li>It must start with either http:// or https://</li>
                  <li>It cannot be less than 10 chars.</li>
                  <li>You can save it by pressing Enter or click Save icon on the right.</li>
                  <li>Or cancel by pressing Esc or click Cancel icon on the most right.</li>
                  <li>You can add consecutive URLs without cancelling.</li>
                  <li>Valid examples
                    <ul>
                      <li>https://www.amazon.com/dp/754</li>
                      <li>https://www.ebay.com/itm/754</li>
                      <li>https://www.argos.co.uk/product/754</li>
                    </ul>
                  </li>
                </ul>
              </v-tooltip>
            </div>
          </v-scroll-x-transition>

        </v-form>
        
        <div v-if="rows && rows.length > 0">

          <v-expansion-panels hover focusable>
            <v-expansion-panel v-for="(row, index) in rows" :key="row.id">
              <v-expansion-panel-header>
                <div class="col pa-0" v-if="row.seller">
                  <span class="blue--text font-weight-bold">{{ row.seller }}</span>
                  <span class="ml-1">({{ row.platform }})</span>
                </div>
                <div class="col pa-0 text-right" v-if="row.price > 0">
                  <span class="font-weight-bold">{{ row.price | toPrice }}</span>
                </div>
                <div class="col pa-0 text-truncate" v-if="row.problem" :title="row.problem">
                  {{ row.url }}
                </div>
                <div class="col pa-0 text-truncate" v-if="row.problem" :title="row.problem">
                  <span class="red--text"> {{ row.problem }}</span>
                </div>
                <div class="col pa-0 text-truncate text-center" v-else>
                  <span>{{ row.status }}</span>
                </div>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="px-2">

                <div v-if="row.price > 0" class="mt-3">
                  <v-btn-toggle tile v-model="selectedTab">
                    <v-btn @click="selectedTab=0" small>Info</v-btn>
                    <v-btn @click="selectedTab=1" small>History</v-btn>
                    <v-btn @click="selectedTab=2" small>Prices</v-btn>
                    <v-btn @click="selectedTab=3" small>Specs</v-btn>
                  </v-btn-toggle>
                </div>

                <v-tabs v-model="selectedTab" v-if="row.price > 0" class="v-card v-sheet theme--light mb-2">
                  <!-- INFO -->
                  <v-tab-item class="py-2">
                    <v-simple-table class="col property-table" dense>
                      <template v-slot:default>
                        <tbody>
                          <tr>
                            <td class="prop-name">Price</td>
                            <td><v-text-field solo dense readonly hide-details="true" class="col-2" :value="row.price | toPrice" /></td>
                          </tr>
                          <tr>
                            <td class="prop-name">Last Updated</td>
                            <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="row.lastUpdate | formatDate" /></td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tab-item>
                  <!-- HISTORY -->
                  <v-tab-item class="pb-2">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">Status</th>
                            <th width="20%">Problem</th>
                            <th class="text-center">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line) in row.historyList" :key="line.id">
                            <td class="text-center">{{ line.status }}</td>
                            <td>{{ line.problem }}</td>
                            <td class="text-center">
                              <ago :date="line.createdAt" />
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tab-item>
                  <!-- PRICES -->
                  <v-tab-item class="pb-2">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">Price</th>
                            <th class="text-center">Position</th>
                            <th class="text-center">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line) in row.priceList" :key="line.id">
                            <td class="text-center">{{ line.price | toPrice }}</td>
                            <td class="text-center">{{ line.position | toPosition }}</td>
                            <td class="text-center">
                              <ago :date="line.createdAt" />
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tab-item>
                  <!-- SPECS -->
                  <v-tab-item class="pb-2">
                    <v-simple-table dense>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-center">Key</th>
                            <th class="text-center">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(line) in row.specList" :key="line.id">
                            <td class="text-center">{{ line.key }}</td>
                            <td class="text-center">{{ line.value }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-tab-item>
                </v-tabs>

                <div class="d-flex py-2">
                  <div class="col text-truncate caption pt-1">
                    <v-icon small>mdi-link-variant</v-icon> <a :href="row.url" target="_blank">{{ row.url }}</a>
                  </div>

                  <div v-if="$store.get('auth/IS_EDITOR')" class="mr-2">
                    <v-btn class="mx-1" small @click="changeStatus(index, row.id, 'PAUSED')" v-if="isSuitable(row.status, 'PAUSED')">Pause</v-btn>
                    <v-btn class="mx-1" small @click="changeStatus(index, row.id, 'RESUMED')" v-if="isSuitable(row.status, 'RESUMED')">Resume</v-btn>
                    <v-btn class="mx-1" small dark color="red" v-if="$store.get('auth/IS_EDITOR')" @click="remove(index, row.id, (row.name || row.url))">Delete</v-btn>
                  </div>
                </div>

              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        </div>

        <confirm ref="confirm"></confirm>
      </div>

      <div v-else>
        Invalid product!
      </div>
    </v-card>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import Utility from '@/helpers/utility';
import normalizeUrl from 'normalize-url';

export default {
  props: ["prodId", "links"],
  data() {
    return {
      url: '',
      isUrlValid: false,
      loading: false,
      showAddNewBar: false,
      rules: {},
      rows: [],
      rulesPopup: false,
      selectedTab: 0,
    }
  },
  methods: {
    openAddNewBar() {
      this.showAddNewBar = true;
    },
    clearAddNewBar(hide=false) {
      this.rules = {};
      this.url = '';
      if (hide == true) {
        this.showAddNewBar = false;
      }
    },
    async addNew() {
      this.url = normalizeUrl(this.url, { defaultProtocol: 'https:', removeQueryParameters: ['ref'] });
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.addNewForm.validate();
      if (this.isUrlValid) {
        this.loading = true;
        const result = await LinkService.insert({ url: this.url, productId: this.prodId });
        if (result.status == true) {
          this.$store.commit('snackbar/setMessage', { text: 'URL is successfully added.' });
          this.clearAddNewBar();
          this.rows.push(result.data);
        }
        this.loading = false;
      }
    },
    async changeStatus(index, id, status) {
      const result = await LinkService.changeStatus(id, status);
      if (result == true) {
        this.rows[index].status = status;
      }
    },
    remove(index, id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            this.rows.splice(index, 1);
            this.$store.commit('snackbar/setMessage', { text: 'URL is successfully deleted.' });
          }
        }
      });
    },
    isSuitable(current, target) {
      switch (current) {
        case 'AVAILABLE':
          return (target == 'PAUSED');
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
    },
    activateRules() {
      this.rules = {
        url: [
          v => !!v || "Required",
          v => (v.length >= 10 && v.length <= 1024) || "URL must be longer than 10 chars",
          v => Utility.verifyURL(v) || "Invalid URL! It must be the exact address of your link's product page.",
        ],
      }
    },
  },
  components: {
    confirm: () => import('@/component/Confirm.vue'),
  },
  mounted() {
    this.$nextTick(() => {
      this.rows = this.links
    });
  },
  watch: {
    links() {
      this.rows = this.links;
    }
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
