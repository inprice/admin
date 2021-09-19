<template>
  <div>
    <div class="title">Links</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between" v-if="CURSTAT.planId">
      <div 
        class="pl-0 d-flex"
        :class="$vuetify.breakpoint.name == 'xs' ? 'col-10' : 'col-6'"
      >
        <v-text-field 
          :loading="loading"
          v-model="searchForm.term"
          dense solo
          maxlength="100"
          hide-details
          placeholder="Search..."
        >
          <template v-slot:append>
            <v-menu
              offset-y
              bottom left
              v-model="filterPanelShow"
              :close-on-content-click="false"
              transition="scale-x-transition"
            >
							<template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-filter-menu-outline</v-icon>
							</template>
            
              <v-card style="max-width:350px">
                <v-card-text class="pb-1">
                  <div class="body-1 pb-2 d-flex justify-space-between">
                    <span class="my-auto">Filters</span>
                    <v-btn
                      icon
                      tabindex="-1"
                      @click="filterPanelShow = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    hide-details
                    label="Levels"
                    v-model="searchForm.levels"
                    :items="levelItems"
                    class="mb-4"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    hide-details
                    label="Statuses"
                    v-model="searchForm.statuses"
                    :items="statusItems"
                    class="mb-4"
                  ></v-select>

                  <div class="d-flex justify-space-around mb-4">
                    <v-select
                      dense
                      outlined
                      hide-details
                      class="pr-1"
                      label="Order By"
                      v-model="searchForm.orderBy"
                      :items="orderByItems"
                    ></v-select>

                    <v-select
                      dense
                      outlined
                      hide-details
                      class="pl-1"
                      label="Order Dir"
                      v-model="searchForm.orderDir"
                      :items="orderDirItems"
                    ></v-select>
                  </div>

                  <div class="d-flex justify-space-around mb-2">
                    <v-select
                      dense
                      outlined
                      hide-details
                      class="pr-1"
                      label="Alarm ?"
                      v-model="searchForm.alarmStatus"
                      :items="alarmItems"
                    ></v-select>

                    <v-select
                      dense
                      outlined
                      hide-details
                      class="pl-1"
                      label="Row Limit"
                      v-model="searchForm.rowLimit"
                      :items="rowLimitItems"
                    ></v-select>
                  </div>

                  <v-divider class="mt-3"></v-divider>

                  <v-card-actions class="justify-end">
                    <v-btn
                      text
                      @click="resetForm"
                      tabindex="-1"
                    >
                      Reset
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="applyOptions"
                    >
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </div>

      <div class="my-auto">
        <template>
          <v-menu
            offset-y
            bottom left
            transition="scale-x-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                color="white"
                :disabled="selected < 1 || $store.get('session/isNotEditor')"
              >
                Menu ({{ selected }})
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item @click="deleteMultiple">
                <v-list-item-title>DELETE</v-list-item-title>
              </v-list-item>
              <v-list-item @click="moveMultiple">
                <v-list-item-title>MOVE</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </div>
    </div>

    <div class="col pa-0" v-if="CURSTAT.planId">
      <div v-if="searchResult && searchResult.length">
        <links-table
          :fromLinksPage="true"
          :links="searchResult"
          @checked="refreshSelected"
          @deleteOne="deleteOne"
          @moveOne="moveOne"
          @openAlarmDialog="openAlarmDialog"
        >
        </links-table>

        <div class="mt-3 text-right">
          <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length">More</v-btn>
        </div>
      </div>

      <v-card v-else>
        <block-message 
          :loading="loading"
          :message="loading ? 'Loading, please wait...' : 'No link found! Please change your criteria.'" 
        />
      </v-card>
    </div>

    <v-card v-else>
      <block-message class="mt-2">
        You are not allowed to manage your products until activate your workspace!
        <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center' : 'right float-right')">
          <v-btn 
            small
            :disabled="$store.get('session/isNotEditor')"
            color="success"
            class="my-auto"
            @click="$router.push( { name: 'plans' })"
          >
            See Plans
          </v-btn>
        </div>
      </block-message>
    </v-card>

    <confirm ref="confirm" />

    <product-select-dialog ref="productSelectDialog"></product-select-dialog>

  </div>
</template>

<script>
import LinkService from '@/service/link';
import AlarmService from '@/service/alarm';
import { get } from 'vuex-pathify'

const levelItems = ['LOWEST', 'HIGHEST', 'LOWER', 'AVERAGE', 'HIGHER', 'EQUAL', 'NA'];
const statusItems = ['ACTIVE', 'WAITING', 'TRYING', 'PROBLEM'];
const orderByItems = ['NAME', 'SELLER', 'BRAND', 'SKU', 'PLATFORM', 'LEVEL', 'PRICE', 'CHECKED_AT', 'UPDATED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const alarmItems = ['ALL', 'ALARMED', 'NOT_ALARMED'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  levels: [],
  statuses: [],
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  alarmStatus: alarmItems[0],
  rowCount: 0,
}

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelShow: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      levelItems,
      statusItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      alarmItems,
      baseSearchForm,
      loading: false,
      selected: 0,
    };
  },
  methods: {
    applyOptions() {
      this.filterPanelShow = false;
      this.search();
    },
    search(hideLoading) {
      if (!hideLoading) this.loading = true;
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
        this.selected = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      LinkService.search(this.searchForm)
        .then((res) => {
          this.isLoadMoreDisabled = true;
          if (res?.length) {
            if (loadMore == true) {
              this.searchResult = this.searchResult.concat(res);
            } else {
              this.searchResult = res;
            }
          } else {
            if (!loadMore) this.searchResult = [];
          }
          if (res) {
            this.isLoadMoreDisabled = (res.length < this.searchForm.rowLimit);
          }
      }).finally(() => {
        if (!hideLoading) this.loading = false;
      });
    },
    resetForm() {
      this.filterPanelShow = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    refreshSelected() {
      let count = 0;
      if (this.searchResult) {
        this.searchResult.forEach(row => {
          if (row.selected) count += 1;
        });
      }
      this.selected = count;
    },
    async deleteOne(row) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', (row.name || row.url)).then(async (confirm) => {
        if (confirm == true) {
          const result = await LinkService.remove([ row.id ]);
          if (result && result.status) this.search(true);
        }
      });
    },
    deleteMultiple() {
      if (this.selected) {
        const selection = [];
        if (this.searchResult) {
          this.searchResult.forEach(row => {
            if (row.selected) {
              selection.push(row.id);
            }
          });
        }
        const title = `${selection.length} links`;
        this.$refs.confirm.open('Delete', ' will be deleted. Are you sure?', title).then(async (confirm) => {
          if (confirm == true) {
            const result = await LinkService.remove(selection);
            if (result && result.status) this.search(true);
          }
        });
      }
    },
    async moveOne(row) {
      this.$refs.productSelectDialog.open('For the selected link, please select a product to move').then(async (data) => {
        if (data && (data.id || data.name)) {
          const result = await LinkService.moveTo({
            toProductId: data.id,
            toProductName: data.name,
            linkIdSet: [ row.id ],
          });
          if (result && result.status) this.search(true);
        }
      });
    },
    moveMultiple() {
      if (this.selected) {
        const selection = [];
        if (this.searchResult) {
          this.searchResult.forEach(row => {
            if (row.selected) {
              selection.push(row.id);
            }
          });
        }
        const title = `${selection.length} links`;
        this.$refs.productSelectDialog.open(`For selected ${title}, please select a product to move`).then(async (data) => {
          if (data && (data.id || data.name)) {
            const result = await LinkService.moveTo({
              toProductId: data.id,
              toProductName: data.name,
              linkIdSet: selection,
            });
            if (result && result.status) this.search(true);
          }
        });
      }
    },
    openAlarmDialog(link) {
      let cloned = {};
      if (link.alarm) {
        cloned = JSON.parse(JSON.stringify(link.alarm));
      } else {
        cloned = {
          subject: 'STATUS',
          subjectWhen: 'CHANGED',
          amountLowerLimit: 0,
          amountUpperLimit: 0,
        };
      }
      cloned.topic = 'LINK';
      cloned.linkId = link.id;
      cloned.name = link.name || link.url;
      this.$refs.alarmDialog.open(cloned);
    },
    saveAlarm(form) {
      AlarmService.save(form);
    },
    setAlarmOff(form) {
      AlarmService.remove(form.id);
    },
  },
  mounted() {
    this.search();
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    }
  },
  components: {
    LinksTable: () => import('../link/LinksTable.vue'),
    ProductSelectDialog: () => import('@/views/product/Select.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
