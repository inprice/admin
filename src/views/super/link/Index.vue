<template>
  <div>
    <div class="title">Links</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="col-6 pl-0 d-flex">
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
                  no-data-text="No account found!"
                  v-model="searchForm.accountId"
                  :items="accounts"
                  :loading="isAccountsLoading"
                  :search-input.sync="searchForm.accountTerm"
                  item-value="left"
                  item-text="right"
                  label="Account"
                  placeholder="Type to search"
                  class="mb-4"
                ></v-autocomplete>

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
import SU_AccountService from '@/service/super/account';

const levelItems = ['LOWEST', 'HIGHEST', 'LOWER', 'AVERAGE', 'HIGHER', 'EQUAL'];
const statusItems = ['ACTIVE', 'WAITING', 'TRYING', 'PROBLEM'];
const orderByItems = ['NAME', 'SELLER', 'BRAND', 'SKU', 'PLATFORM', 'LEVEL', 'PRICE', 'CHECKED_AT', 'UPDATED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const alarmItems = ['ALL', 'ALARMED', 'NOT_ALARMED'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  accountId: null,
  accountTerm: null,
  levels: [],
  statuses: [],
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  alarmStatus: alarmItems[0],
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelShow: false,
      searchResult: [],
      accounts: [],
      isAccountsLoading: false,
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
    'searchForm.accountTerm'(val) {
      if (this.searchForm.accountTerm == undefined) return;
      this.isAccountsLoading = true;
      SU_AccountService.getIdNameList(val).then((res) => {
        if (res && res.data) {
          this.accounts = res.data;
        }
      }).finally(() => this.isAccountsLoading = false);
    }
  },
  components: {
    List: () => import('./List'),
  },
}
</script>
