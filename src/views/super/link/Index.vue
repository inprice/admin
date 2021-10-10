<template>
  <div>
    <div class="title">Links</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
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
                <div class="pb-2 d-flex justify-space-between">
                  <span class="body-1 my-auto">Filters</span>
                  <v-btn
                    icon
                    tabindex="-1"
                    @click="filterPanelShow = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </div>

                <v-autocomplete
                  dense
                  outlined
                  hide-details
                  clearable
                  no-data-text="No workspace found!"
                  v-model="searchForm.workspaceId"
                  :items="workspaces"
                  :loading="isWorkspacesLoading"
                  :search-input.sync="searchForm.workspaceTerm"
                  item-value="left"
                  item-text="right"
                  label="Workspace"
                  placeholder="Type to search"
                  class="mb-4"
                ></v-autocomplete>

                <v-select
                  dense
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="Positions"
                  v-model="searchForm.positions"
                  :items="positionItems"
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
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions class="justify-end">
                <v-btn
                  text
                  @click="resetForm"
                  tabindex="-1"
                >
                  Clear
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="applyOptions"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>

          </v-menu>
        </template>
      </v-text-field>
    </div>

    <list
      ref="list"
      :rows="searchResult"
      @refreshList="search"
    />

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">More</v-btn>
    </div>

  </div>

</template>

<script>
import SU_LinkService from '@/service/super/link';
import SU_WorkspaceService from '@/service/super/workspace';

import SystemData from '@/data/system';

const ORDER_ITEMS = [
  { text: 'Name', value: 'NAME' },
  { text: 'Sku', value: 'SKU' },
  { text: 'Seller', value: 'SELLER' },
  { text: 'Platform', value: 'PLATFORM' },
  { text: 'Position', value: 'POSITION' },
  { text: 'Price', value: 'PRICE' },
  { text: 'Brand', value: 'BRAND' },
  { text: 'Checked At', value: 'CHECKED_AT' },
  { text: 'Updated At', value: 'UPDATED_AT' }
];

const baseSearchForm = {
  term: '',
  workspaceId: null,
  workspaceTerm: null,
  positions: [],
  statuses: [],
  orderBy: ORDER_ITEMS[0].value,
  orderDir: SystemData.ORDERING[0].value,
  rowLimit: SystemData.ROW_LIMITS[0],
  alarmStatus: SystemData.ALARM_STATES[0].value,
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelShow: false,
      searchResult: [],
      workspaces: [],
      isWorkspacesLoading: false,
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      positionItems: SystemData.POSITIONS,
      statusItems: SystemData.LINK_STATUSES,
      orderByItems: ORDER_ITEMS,
      orderDirItems: SystemData.ORDERING,
      rowLimitItems: SystemData.ROW_LIMITS,
      alarmItems: SystemData.ALARM_STATES,
      baseSearchForm,
      loading: false,
    };
  },
  methods: {
    applyOptions() {
      this.filterPanelShow = false;
      this.search();
    },
    search() {
      this.loading = true;
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
        if (this.$refs.list) this.$refs.list.clearSelected();
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      SU_LinkService.search(this.searchForm)
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
      }).finally(() => this.loading = false);
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
  },
  mounted() {
    this.search();
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    },
    'searchForm.workspaceTerm'(val) {
      if (this.searchForm.workspaceTerm == undefined) return;
      this.isWorkspacesLoading = true;
      SU_WorkspaceService.getIdNameList(val).then((res) => {
        if (res && res.data) {
          this.workspaces = res.data;
        }
      }).finally(() => this.isWorkspacesLoading = false);
    }
  },
  components: {
    List: () => import('./List'),
  },
}
</script>
