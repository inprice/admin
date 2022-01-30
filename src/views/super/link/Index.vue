<template>
  <div>
    <div class="title">Links</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <v-text-field 
        :loading="loading"
        v-model="searchForm.term"
        dense solo
        maxlength="100"
        hide-details
        placeholder="Search..."
        class="pt-2 pb-3"
        :class="$vuetify.breakpoint.name == 'xs' ? 'col-10' : 'col-6'"
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
                  class="mb-4"
                  v-model="searchForm.positions"
                  :items="positionItems"
                  item-text="text"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
                ></v-select>

                <v-select
                  dense
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="Statuses"
                  class="mb-4"
                  v-model="searchForm.statuses"
                  :items="statusItems"
                  item-text="text"
                  item-value="value"
                  :menu-props="{ bottom: true, offsetY: true }"
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
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pl-1"
                    label="Order Dir"
                    v-model="searchForm.orderDir"
                    :items="orderDirItems"
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
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
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pl-1"
                    label="Row Limit"
                    v-model="searchForm.rowLimit"
                    :items="rowLimitItems"
                    :menu-props="{ bottom: true, offsetY: true }"
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

      <v-menu bottom right offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            small
            class="ml-2 my-auto"
            v-on="on"
            v-bind="attrs"
            :disabled="!selected"
          >
            Menu ({{ selected }})
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item link @click="changeMultipleStatus('REFRESHED')">
            <v-list-item-title>REFRESHED</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="changeMultipleStatus('RESOLVED')">
            <v-list-item-title>RESOLVED</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="changeMultipleStatus('PAUSED')">
            <v-list-item-title>PAUSED</v-list-item-title>
          </v-list-item>

          <v-list-item link @click="changeMultipleStatus('NOT_SUITABLE')">
            <v-list-item-title>NOT SUITABLE</v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link @click="undoMultiple()">
            <v-list-item-title>UNDO LAST CHANGE</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-menu>
      
    </div>

    <div v-if="searchResult && searchResult.length">
      <links-table
        :fromLinksPage="true"
        :links="searchResult"
        @changeStatus="changeOneStatus"
        @undoStatus="undoOne"
        @checked="refreshSelected"
      >
      </links-table>
    </div>

    <div class="pa-3 pr-0 text-right" v-if="searchResult && searchResult.length">
      <v-btn 
        small
        @click="loadmore" 
        :disabled="isLoadMoreDisabled" 
      >
        More
      </v-btn>
    </div>

    <v-card v-else>
      <block-message 
        :loading="loading"
        :message="loading ? 'Loading, please wait...' : 'No link found! Please change your criteria.'" 
      />
    </v-card>

    <confirm ref="confirm"></confirm>
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
      selected: 0,
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
    changeOneStatus(data) {
      this.changeStatusCommon([ data.id ], data.newStatus);
    },
    changeMultipleStatus(newStatus) {
      const selection = this.findSelectedIds();
      this.changeStatusCommon(selection, newStatus);
    },
    changeStatusCommon(ids, newStatus) {
      if (ids && ids.length && newStatus) {
        let title = '';
        if (ids.length > 1) {
          title = `${ids.length} links statuses`;
        } else {
          title = 'Link status';
        }
        this.$refs.confirm.open('Change Status', `${title} will be changed to ${newStatus}. Are you sure?`).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.changeStatus(ids, newStatus);
            if (result) {
              this.search();
              this.$store.commit('snackbar/setMessage', { text: `${title} successfully updated.` });
            }
          }
        });
      }
    },
    undoOne(id) {
      this.undoCommon([ id ]);
    },
    undoMultiple() {
      const selection = this.findSelectedIds();
      this.undoCommon(selection);
    },
    undoCommon(ids) {
      if (ids && ids.length) {
        let title = '';
        if (ids.length > 1) {
          title = `${ids.length} links last transactions `;
        } else {
          title = 'Link\'s last transaction ';
        }
        this.$refs.confirm.open('Undo Last', `${title} will be rolled back. Are you sure?`).then(async (confirm) => {
          if (confirm == true) {
            const result = await SU_LinkService.undo(ids);
            if (result) {
              this.search();
              this.$store.commit('snackbar/setMessage', { text: `${title} successfully rolled back to previous status.` });
            }
          }
        });
      }
    },
    findSelectedIds() {
      let selection = [];
      for (var i=0; i<this.searchResult.length; i++) {
        const link = this.searchResult[i];
        if (link.selected) selection.push(link.id);
      }
      return selection;
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
      }).finally(() => {
        this.loading = false
        this.selected = 0;
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
    LinksTable: () => import('../../link/LinksTable.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
