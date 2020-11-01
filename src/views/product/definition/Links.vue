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
                  <span>{{ row.seller }}</span>
                  <span class="ml-1">({{ row.platform }})</span>
                </div>
                <div class="col pa-0 text-right" v-if="row.price > 0">
                  <span class="font-weight-bold">{{ row.price | toPrice }}</span>
                </div>
                <div class="col pa-0 text-truncate caption font-italic" v-if="!row.name" :title="row.problem">
                  {{ row.url }}
                </div>
                <div class="col-4 pa-0 mx-2 text-truncate" :title="row.problem">
                  {{ row.problem || row.status }}
                </div>
              </v-expansion-panel-header>

              <v-expansion-panel-content class="px-2">

                <div class="d-flex justify-space-between pt-2">
                  <div>
                    <div class="caption">#{{ row.sku || 'PROBLEM' }} ({{ row.position | toPosition }})</div>
                    <div>{{ row.name || row.problem }}</div>
                    <div class="text-truncate caption font-italic">
                      <a :href="row.url" target="_blank">{{ row.url }}</a>
                    </div>
                  </div>

                  <div class="pt-2">
                    <v-btn class="d-block mb-2" small @click="toggleStatus(index, row.id)">
                      <span v-if="row.status=='PAUSED'">Resume</span>
                      <span v-else>Pause</span>
                    </v-btn>
                    <v-btn class="d-block" small @click="remove(index, row.id, (row.name || row.url))">Delete</v-btn>
                  </div>
                </div>

                <link-details
                  :key="detailsRefreshCount"
                  :showInfoTab="true"
                  :price="row.price"
                  :lastUpdate="row.lastUpdate"
                  :historyList="row.historyList"
                  :priceList="row.priceList"
                  :specList="row.specList"
                />

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
import moment from 'moment-timezone';

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
      detailsRefreshCount: 0,
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
    toggleStatus(index, id) {
      let status = 'PAUSED';
      if (this.rows[index].historyList[0].status == status) {
        status = this.rows[index].historyList[1].status;
      }

      if (this.rows[index].historyList.length > 2) {
        const row0 = this.rows[index].historyList[0];
        const row2 = this.rows[index].historyList[2];
        if (row0.status == row2.status) {
          const now = moment();
          const diff0 = now.diff(row0.createdAt, 'days');
          const diff2 = now.diff(row2.createdAt, 'days');
          if (diff0 == 0 && diff2 == 0) {
            this.$store.commit('snackbar/setMessage', { text: 'You are not allowed to Pause/Resume a link more than twice in the same day!' });
            return;
          }
        }
      }

      LinkService.toggleStatus(id);

      const select = (status == 'PAUSED' ? 0 : 1);
      const newOne = JSON.parse(JSON.stringify(this.rows[index].historyList[select]));
      newOne.status = status;
      if (select == 0) {
        newOne.problem = null;
        newOne.httpStatus = 0;
      }
      this.rows[index].historyList.unshift(newOne);
      this.detailsRefreshCount++;
      this.$emit("statusToggled");
    },
    remove(index, id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove(id);
          if (result == true) {
            this.rows.splice(index, 1);
            this.$store.commit('snackbar/setMessage', { text: 'URL is successfully deleted.' });
            this.$emit("deleted");
          }
        }
      });
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
    LinkDetails: () => import('@/views/link/components/LinkDetails.vue'),
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
