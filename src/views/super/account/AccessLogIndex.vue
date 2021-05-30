<template>

  <div>

    <div class="d-flex justify-space-between px-4 py-2 pt-4">
      <div>
        <div class="body-2">Account's access logs.</div>
        <div class="title">{{ $route.query.name }}</div>
      </div>

      <v-btn 
        small
        class="my-auto"
        @click="$router.go(-1)"
      >
        Go Back
      </v-btn>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div>

      <div class="col-10 pl-0 d-flex">
        <v-text-field 
          ref="term"
          autofocus
          outlined dense
          hide-details
          maxlength="100"
          v-model="searchForm.term"
          :label="searchForm.searchBy"
          :placeholder="'Search by ' + searchForm.searchBy"
        >
          <template v-slot:append>
            <v-menu
              offset-y
              bottom left
              v-model="searchMenuOpen"
              :close-on-content-click="false"
              max-width="400">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon small
                  v-bind="attrs"
                  v-on="on"
                  tabindex="-1"
                  style="margin-top: 5px;"
                >
                  <v-badge
                    dot overlap
                    color="red"
                    :value="!deepEqual(searchForm, baseSearchForm)"
                  >
                    <v-icon>mdi-filter-menu-outline</v-icon>
                  </v-badge>
                </v-btn>
              </template>

              <v-card>
                <v-card-text class="pb-0">
                  <div class="subtitle-1 pb-1 d-flex justify-space-between">
                    <span>Search Options</span>
                    <v-icon style="cursor: pointer" @click="searchMenuOpen = false">mdi-close</v-icon>
                  </div>
                  
                  <v-divider class="py-2 pb-4"></v-divider>

                  <v-select
                    autofocus
                    dense
                    outlined
                    label="Search By"
                    v-model="searchForm.searchBy"
                    :items="searchByItems"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    label="Users"
                    v-model="searchForm.user"
                    :items="userItems"
                    item-text="value"
                    item-value="key"
                    clearable
                    @click:clear="searchForm.user=null"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.value }}
                    </template>
                  </v-select>

                  <div class="d-flex">
                    <v-menu
                      ref="startDateMenu"
                      v-model="startDateMenuOpen"
                      :close-on-content-click="false"
                      :return-value.sync="searchForm.startDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          readonly
                          dense
                          outlined
                          v-model="searchForm.startDate"
                          label="Start Date"
                          v-on="on"
                          v-bind="attrs"
                          class="pr-2"
                        ></v-text-field>
                      </template>

                      <v-date-picker
                        no-title
                        scrollable
                        v-model="searchForm.startDate"
                      >
                        <v-btn
                          text
                          @click="startDateMenuOpen = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="red"
                          :disabled="!searchForm.startDate"
                          @click="resetStartDate"
                        >
                          Reset
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.startDateMenu.save(searchForm.startDate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-menu
                      ref="endDateMenu"
                      v-model="endDateMenuOpen"
                      :close-on-content-click="false"
                      :return-value.sync="searchForm.endDate"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          readonly
                          dense
                          outlined
                          v-model="searchForm.endDate"
                          label="End Date"
                          v-on="on"
                          v-bind="attrs"
                          class="px-2"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        scrollable
                        v-model="searchForm.endDate"
                      >
                        <v-btn
                          text
                          @click="endDateMenuOpen = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="red"
                          :disabled="!searchForm.endDate"
                          @click="resetEndDate"
                        >
                          Reset
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.endDateMenu.save(searchForm.endDate)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </div>

                  <div class="d-flex justify-space-around">
                    <v-select
                      class="col mr-2"
                      dense
                      outlined
                      label="Order By"
                      v-model="searchForm.orderBy"
                      :items="orderByItems"
                    ></v-select>

                    <v-select
                      class="col mx-2"
                      dense
                      outlined
                      label="Order Dir"
                      v-model="searchForm.orderDir"
                      :items="orderDirItems"
                    ></v-select>
                  </div>

                  <div class="d-flex justify-space-around">
                    <v-select
                      class="col mr-2"
                      dense
                      outlined
                      label="Method"
                      v-model="searchForm.method"
                      :items="methodItems"
                    ></v-select>

                    <v-select
                      class="col mx-2"
                      dense
                      outlined
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
                    Reset
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

    </div>
    
    <div class="col pa-0" v-if="searchResult">
      <list :rows="searchResult" :selectedId="showingRowId" @selected="rowSelected" />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">Load More</v-btn>
      </div>
    </div>

    <block-message v-else :message="`No log found.`" />

  </div>

</template>

<script>
import SU_AccountService from '@/service/super/account';

const searchByItems = ['PATH', 'STATUS', 'REQ_BODY', 'RES_BODY', 'IP'];
const methodItems = ['GET', 'POST', 'PUT', 'DELETE'];
const orderByItems = ['DATE', 'PATH', 'STATUS', 'IP', 'ELAPSED', 'METHOD', 'SLOW'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  startDate: null,
  endDate: null,
  method: null,
  user: null,
  searchBy: searchByItems[0],
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  data() {
    baseSearchForm.accountId = this.$route.params.aid;
    return {
      searchMenuOpen: false,
      startDateMenuOpen: false,
      endDateMenuOpen: false,
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      searchResult: [],
      isListLoading: true,
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      searchByItems,
      methodItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      userItems: [],
      baseSearchForm,
      showingRowId: null,
    };
  },
  methods: {
    applyOptions() {
      this.searchMenuOpen = false;
      this.search();
      this.$refs.term.focus();
    },
    search() {
      if (!this.searchForm.accountId) {
        console.error("Account id is not specified!");
        return;
      }

      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isListLoading = true;
      this.isLoadMoreClicked = false;

      SU_AccountService.searchForLogs(this.searchForm)
        .then((res) => {
          this.isListLoading = false;
          this.isLoadMoreDisabled = true;
          if (res?.length) {
            if (loadMore == true) {
              this.searchResult = this.searchResult.concat(res);
            } else {
              this.searchResult = res;
            }
          } else {
            this.searchResult = [];
          }
          if (res) {
            this.isLoadMoreDisabled = (res.length < this.searchForm.rowLimit);
          }
      });
    },
    resetForm() {
      this.searchMenuOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
      this.$refs.term.focus();
    },
    resetStartDate() {
      this.searchForm.startDate = null;
      this.$refs.startDateMenu.save(null);
    },
    resetEndDate() {
      this.searchForm.endDate = null;
      this.$refs.endDateMenu.save(null);
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    rowSelected(rowId) {
      if (this.showingRowId && this.showingRowId == rowId) {
        this.showingRowId = null;
      } else {
        this.showingRowId = rowId;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.search()
      SU_AccountService.fetchUserList(this.searchForm.accountId).then((res) => {
        if (res && res.data) {
          this.userItems = res.data;
        }
      });
    });
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    }
  },
  components: {
    List: () => import('../component/AccessLogList.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
