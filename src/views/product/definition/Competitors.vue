<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-multiple</v-icon>
        <div>
          <div>Competitors</div>
          <div class="caption">The list of your competitors for the products displayed on this page.</div>
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
            <div class="d-flex" v-if="showAddNewBar">
              <v-text-field 
                ref="addNewBar"
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
                  <li>URL must be the exact address of your competitor's product page.</li>
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

          <v-expansion-panels accordion hover focusable>
            <v-expansion-panel v-for="(row, index) in rows" :key="row.id">
              <v-expansion-panel-header>
                <div class="col pa-0" v-if="row.seller">
                  <span class="blue--text font-weight-bold">{{ row.seller }}</span> / {{ row.platform }}
                </div>
                <div class="col pa-0 text-truncate " v-else>
                  {{ row.url }}
                </div>
                <div class="col-3 pa-0">
                  {{ row.status || 'NA' }}
                </div>
              </v-expansion-panel-header>

              <v-expansion-panel-content>

                <v-simple-table class="col property-table pa-1" dense>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <td class="prop-name">Seller</td>
                        <td><v-text-field solo dense readonly hide-details="true" class="col-6" :value="row.seller || 'NA'" /></td>
                      </tr>
                      <tr>
                        <td class="prop-name">Platform</td>
                        <td><v-text-field solo dense readonly hide-details="true" class="col-6" :value="row.platform || 'NA'" /></td>
                      </tr>
                      <tr>
                        <td class="prop-name">Status</td>
                        <td><v-text-field solo dense readonly hide-details="true" class="col-4" :value="row.status" /></td>
                      </tr>
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

                <div class="d-flex pb-3">
                  <div class="col text-truncate caption pt-1 pb-0" v-if="row.seller">
                    <v-icon small>mdi-link-variant</v-icon> <a :href="row.url" target="_blank">{{ row.url }}</a>
                  </div>
                  <v-spacer v-else></v-spacer>
                  <div v-if="$store.get('auth/IS_EDITOR')" class="mr-2">
                    <v-btn class="mx-1" small @click="changeStatus(index, row.id, 'RENEWED')" v-if="isSuitable(row.status, 'TOBE_RENEWED')">Renew</v-btn>
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

    <v-snackbar 
      v-model="snackbar" 
      :timeout="2500" 
      color="info"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          color="white"
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </div>

</template>

<script>
import CompetitorService from '@/service/competitor';
import Utility from '@/helpers/utility';

export default {
  props: ["prodId", "competitors"],
  data() {
    return {
      url: '',
      isUrlValid: false,
      loading: false,
      showAddNewBar: false,
      rules: {},
      snackbar: false,
      snackbarText: '',
      rows: [],
      rulesPopup: false,
    }
  },
  methods: {
    openAddNewBar() {
      this.showAddNewBar = true;
      Utility.doubleRaf(() => this.$refs.addNewBar.focus());
    },
    clearAddNewBar(hide=false) {
      this.rules = {};
      this.url = '';
      if (hide == true) {
        this.showAddNewBar = false;
        this.snackbar = false;
      }
    },
    async addNew() {
      if (Object.keys(this.rules).length == 0) this.activateRules();
      await this.$refs.addNewForm.validate();
      if (this.isUrlValid) {
        this.loading = true;
        const result = await CompetitorService.insert({ url: this.url, productId: this.prodId });
        if (result.status == true) {
          this.snackbarText = 'URL is successfully added.'
          this.snackbar = true;
          this.clearAddNewBar();
          this.rows.push(result.data);
        }
        this.loading = false;
      }
    },
    async changeStatus(index, id, status) {
      const result = await CompetitorService.changeStatus(id, status);
      if (result == true) {
        this.rows[index].status = status;
      }
    },
    remove(index, id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await CompetitorService.remove(id);
          if (result == true) {
            this.rows.splice(index, 1);
            this.snackbarText = 'URL is successfully deleted.'
            this.snackbar = true;
          }
        }
      });
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
    },
    activateRules() {
      this.rules = {
        url: [
          v => !!v || "Required",
          v => (v.length >= 10 && v.length <= 1024) || "URL must be longer than 10 chars",
          v => Utility.verifyURL(v) || "Invalid URL! It must be the exact address of your competitor's product page.",
        ],
      }
    },
  },
  components: {
    confirm: () => import('@/component/Confirm.vue')
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.rows = this.competitors
    });
  },
  watch: {
    competitors() {
      this.rows = this.competitors;
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
