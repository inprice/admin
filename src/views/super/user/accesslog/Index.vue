<template>

  <div>
    <div>
      <div class="title">Access Logs</div>
      <div class="body-2">User's access logs.</div>
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
                    label="Accounts"
                    v-model="searchForm.account"
                    :items="accountItems"
                    item-text="name"
                    item-value="id"
                  >
                    <template v-slot:selection="{ item }">
                      {{ item.name }}
                    </template>
                  </v-select>

                  <div class="d-flex justify-space-around">
                    <v-menu
                      ref="startDateMenu"
                      v-model="startDate.menu"
                      :close-on-content-click="false"
                      :return-value.sync="startDate.value"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          readonly
                          v-model="startDate.value"
                          label="Start Date"
                          prepend-icon="mdi-calendar"
                          v-on="on"
                          v-bind="attrs"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        scrollable
                        v-model="startDate.value"
                      >
                        <v-btn
                          text
                          @click="startDate.menu = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="red"
                          @click="resetStartDate"
                        >
                          Reset
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.startDateMenu.save(startDate.value)"
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>

                    <v-menu
                      ref="endDateMenu"
                      v-model="endDate.menu"
                      :close-on-content-click="false"
                      :return-value.sync="endDate.value"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          readonly
                          v-model="endDate.value"
                          label="End Date"
                          prepend-icon="mdi-calendar"
                          v-on="on"
                          v-bind="attrs"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        scrollable
                        v-model="endDate.value"
                      >
                        <v-btn
                          text
                          @click="endDate.menu = false"
                        >
                          Close
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="red"
                          @click="resetEndDate"
                        >
                          Reset
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.endDateMenu.save(endDate.value)"
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
                    outlined
                    @click="resetForm"
                    tabindex="-1"
                  >
                    Reset
                  </v-btn>
                  <v-btn
                    text
                    outlined
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
    
    <div class="col pa-0">
      <list
        ref="list"
        :rows="searchResult"
        @refreshList="search"
      />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">Load More</v-btn>
      </div>
    </div>

  </div>

</template>

<script>
import SU_UserService from '@/service/super/user';

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
  account: null,
  searchBy: searchByItems[0],
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      startDate: {
        menu: false,
        value: null,
      },
      endDate: {
        menu: false,
        value: null,
      },
      searchResult: [],
      isListLoading: true,
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      searchByItems,
      methodItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      accountItems: [],
      baseSearchForm,
    };
  },
  methods: {
    applyOptions() {
      this.searchMenuOpen = false;
      this.search();
      this.$refs.term.focus();
    },
    search() {
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
        if (this.$refs.list) this.$refs.list.clearSelected();
      }

      const loadMore = this.isLoadMoreClicked;
      this.isListLoading = true;
      this.isLoadMoreClicked = false;

      SU_UserService.searchForAccessLog(this.searchForm)
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
      this.$refs.term.focus();
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
  },
  mounted() {
    this.$nextTick(() => {
      const uid = this.$route.params.uid;
      SU_UserService.fetcAccountOfUser(uid).then((res) => {
        if (res && res.status) {
          this.accountItems = res.data;
        }
      });
      this.search();
    });
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    }
  },
  components: {
    List: () => import('./List'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
