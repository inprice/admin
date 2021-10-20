<template>

  <div>

    <div class="d-flex justify-space-between px-4 py-2 pt-4">
      <div>
        <div class="body-2">User's access logs.</div>
        <div class="title">{{ $route.query.email }}</div>
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

                <v-select
                  dense
                  outlined
                  hide-details
                  label="Workspaces"
                  class="mb-4"
                  v-model="searchForm.workspace"
                  :items="workspaceItems"
                  item-text="value"
                  item-value="key"
                  clearable
                  @click:clear="searchForm.workspace=null"
                  :menu-props="{ bottom: true, offsetY: true }"
                >
                  <template v-slot:selection="{ item }">
                    {{ item.value }}
                  </template>
                </v-select>

                <div class="d-flex mb-4">
                  <v-menu
                    v-model="startDateMenuOpen"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        readonly
                        dense
                        outlined
                        clearable
                        hide-details
                        v-model="searchForm.startDate"
                        label="Start Date"
                        v-on="on"
                        v-bind="attrs"
                        class="pr-1"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      no-title
                      scrollable
                      v-model="searchForm.startDate"
                      @input="startDateMenuOpen = false"
                    ></v-date-picker>
                  </v-menu>

                  <v-menu
                    v-model="endDateMenuOpen"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        readonly
                        dense
                        outlined
                        clearable
                        hide-details
                        v-model="searchForm.endDate"
                        label="End Date"
                        v-on="on"
                        v-bind="attrs"
                        class="pl-1"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      no-title
                      scrollable
                      v-model="searchForm.endDate"
                      @input="endDateMenuOpen = false"
                    ></v-date-picker>
                  </v-menu>
                </div>

                <div class="d-flex justify-space-around mb-4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pr-1"
                    label="Order By"
                    v-model="searchForm.orderBy"
                    :items="orderByItems"
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
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
                </div>

                <div class="d-flex justify-space-around mb-2">
                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pr-1"
                    label="Method"
                    v-model="searchForm.method"
                    :items="methodItems"
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
    </div>
    
    <div class="col pa-0" v-if="searchResult">
      <list :rows="searchResult" :selectedId="showingRowId" @selected="rowSelected" />

      <div class="mt-3">
        <v-btn 
          small
          @click="loadmore" 
          :disabled="isLoadMoreDisabled" 
        >
          More
        </v-btn>
      </div>
    </div>

    <block-message v-else :message="`No log found.`" />

  </div>

</template>

<script>
import SU_UserService from '@/service/super/user';

const methodItems = ['GET', 'POST', 'PUT', 'DELETE'];
const orderByItems = ['DATE', 'PATH', 'STATUS', 'IP', 'ELAPSED', 'METHOD', 'SLOW'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  startDate: null,
  endDate: null,
  method: null,
  workspace: null,
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  data() {
    baseSearchForm.userId = this.$route.params.uid;
    return {
      searchMenuOpen: false,
      startDateMenuOpen: false,
      endDateMenuOpen: false,
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      methodItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      workspaceItems: [],
      baseSearchForm,
      showingRowId: null,
      loading: false,
    };
  },
  methods: {
    applyOptions() {
      this.searchMenuOpen = false;
      this.search();
    },
    search() {
      if (!this.searchForm.userId) {
        console.error("User id is not specified!");
        return;
      }

      this.loading = true;

      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      SU_UserService.searchForLogs(this.searchForm)
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
      this.searchMenuOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
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
      SU_UserService.fetchWorkspaceList(this.searchForm.userId).then((res) => {
        if (res && res.data) {
          this.workspaceItems = res.data;
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
