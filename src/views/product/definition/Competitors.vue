<template>
  <div>

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-multiple</v-icon>
        <div>Competitors</div>
      </v-card-title>

      <div v-if="prodId">

        <v-btn 
          dark small
          v-if="!showAddNewBar"
          :disabled="$store.get('auth/IS_JUST_VIEWER')"
          color="success"
          class="ma-2 mb-9"
          @click="openAddNewBar">
            <v-icon>mdi-plus</v-icon>Add new Url
        </v-btn>

        <v-form ref="addNewForm" v-model="isUrlValid" @submit.prevent>
          <v-scroll-x-transition leave-absolute mode="in-out">
            <v-text-field 
              ref="addNewBar"
              v-if="showAddNewBar"
              v-model="url"
              :rules="rules.url"
              @keyup.enter.native="addNew"
              @keyup.esc.native="clearAddNewBar(true)"
              dense solo light
              class="col-10 px-2 pb-2"
              maxlength="1024"
              hint="Example: https://www.zalando.co.uk/zign-polo-shirt-black-zi122p006-q11.html"
              placeholder="Paste the address of the exact page of your competitor and then press Enter. Or Escape">
                <template slot="append">
                  <v-icon class="mr-2" @click="addNew">mdi-check</v-icon>
                  <v-icon  @click="clearAddNewBar(true)">mdi-window-close</v-icon>
                </template>          
            </v-text-field>
          </v-scroll-x-transition>
        </v-form>
        
        <div v-if="rows && rows.length > 0">

          <v-expansion-panels accordion hover focusable>
            <v-expansion-panel v-for="row in rows" :key="row.id">
              <v-expansion-panel-header>
                <div class="col pa-0">
                  {{ row.seller || 'NA' }}
                </div>
                <div class="col pa-0">
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

                <div class="d-flex">
                  <div class="col text-truncate caption pt-1 pb-3">
                    <v-icon small>mdi-link-variant</v-icon> <a :href="row.url" target="_blank">{{ row.url }}</a>
                  </div>
                  <div v-if="$store.get('auth/IS_EDITOR')">
                    <v-btn class="mx-1" small @click="changeStatus(row.id, 'RENEW')" v-if="isSuitable(row.status, 'TOBE_RENEWED')">Renew</v-btn>
                    <v-btn class="mx-1" small @click="changeStatus(row.id, 'PAUSE')" v-if="isSuitable(row.status, 'PAUSED')">Pause</v-btn>
                    <v-btn class="mx-1" small @click="changeStatus(row.id, 'RESUME')" v-if="isSuitable(row.status, 'RESUMED')">Resume</v-btn>
                    <v-btn class="mx-1" small dark color="red" v-if="$store.get('auth/IS_EDITOR')" @click="remove(row.id, (row.name || row.url))">Delete</v-btn>
                  </div>
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
    </v-card>

    <v-snackbar 
      v-model="snackbar" 
      :timeout="3000" 
      color="info"
      bottom centered>
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
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
      rows: []
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
        if (result == true) {
          this.snackbarText = 'URL is successfully added.'
          this.snackbar = true;
          this.clearAddNewBar();
          this.refreshCompetitors();
        }
        this.loading = false;
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
      const result = await CompetitorService.list(this.prodId);
      if (result) {
        this.rows = result;
      } else {
        this.rows = [];
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
    },
    activateRules() {
      this.rules = {
        url: [
          v => !!v || "Required",
          v => (v.length >= 10 && v.length <= 1024) || "URL must be longer than 10 chars",
          v => Utility.verifyURL(v) || "Invalid URL! It should be the address of the exact page of your competitor. It should contain at least the Code, Name and Price fields.",
        ],
      }
    },
  },
  mounted() {
    Utility.doubleRaf(() => this.rows = this.competitors);
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
  .v-expansion-panel--active > .v-expansion-panel-header {
    min-height: auto !important;
  }
</style>
