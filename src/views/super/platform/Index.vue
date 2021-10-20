<template>

  <div>
    <div>
      <div class="title">Platforms</div>
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

                <div class="d-flex justify-space-around mb-4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pr-1"
                    label="Parked ?"
                    v-model="searchForm.parkStatus"
                    :items="booleanItems"
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pl-1"
                    label="Blocked ?"
                    v-model="searchForm.blockStatus"
                    :items="booleanItems"
                    item-text="text"
                    item-value="value"
                    :menu-props="{ bottom: true, offsetY: true }"
                  ></v-select>
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

                <v-select
                  dense
                  outlined
                  hide-details
                  label="Row Limit"
                  v-model="searchForm.rowLimit"
                  :items="rowLimitItems"
                  :menu-props="{ bottom: true, offsetY: true }"
                ></v-select>

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

    <div v-if="searchResult.length" class="v-data-table v-data-table--dense theme--light put-behind">
      <div class="v-data-table__wrapper">
        <table :style="{'table-layout': RESPROPS['table-layout']}">
          <thead>
            <tr>
              <th :width="RESPROPS.table.name">Name</th>
              <th class="hidden-sm-and-down" :width="RESPROPS.table.name">Country</th>
              <th class="hidden-sm-and-down" :width="RESPROPS.table.name">Queue</th>
              <th class="hidden-sm-and-down" :width="RESPROPS.table.profile">Profile</th>
              <th class="text-center" :width="RESPROPS.table.parked">Parked</th>
              <th class="text-center" :width="RESPROPS.table.parked">Blocked</th>
              <th class="hidden-sm-and-down" :width="RESPROPS.table.curcode">Curency</th>
              <th :width="RESPROPS.table.action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in searchResult" :key="row.id" :style="findRowColor(row)" @click="openUpdateDialog(row)" style="cursor: pointer">
              <td>{{ row.name }}</td>
              <td class="hidden-sm-and-down">{{ row.country }}</td>
              <td class="hidden-sm-and-down">{{ row.queue }}</td>
              <td class="hidden-sm-and-down">{{ row.profile }}</td>
              <td class="text-center" :style="row.parked ? 'color: red; font-weight: bold' : ''">{{ row.parked ? 'YES' : 'NO' }}</td>
              <td class="text-center" :style="row.blocked ? 'color: red; font-weight: bold' : ''">{{ row.blocked ? 'YES' : 'NO' }}</td>
              <td class="hidden-sm-and-down">{{ row.currencyCode }}</td>
              <td style="padding: 0px !important; text-align: center !important;">
                <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                  <template v-slot:activator="{ on }">
                    <v-btn small icon v-on="on">
                      <v-icon dark>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="openUpdateDialog(row)">
                      <v-list-item-title>
                        UPDATE
                      </v-list-item-title>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item @click="toggleParked(row.id)">
                      <v-list-item-title>
                        TOGGLE PARKED
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="toggleBlocked(row.id)">
                      <v-list-item-title>
                        TOGGLE BLOCKED
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <block-message 
      v-else dense
      :message="`No plaform found.`"
    />

    <div class="mt-3">
      <v-btn 
        small
        @click="loadmore" 
        :disabled="isLoadMoreDisabled" 
      >
        More
      </v-btn>
    </div>

    <edit ref="platformDialog" @saved="update" />

  </div>

</template>

<script>
import SU_PlatformService from '@/service/super/platform';

import SystemData from '@/data/system';

const ORDER_ITEMS = [
  { text: 'Name', value: 'NAME' },
  { text: 'Domain', value: 'DOMAIN' },
  { text: 'Country', value: 'COUNTRY' },
  { text: 'Class', value: 'CLASS' }
];

const baseSearchForm = {
  term: '',
  parkStatus: SystemData.BOOLEANS[0].value,
  blockStatus: SystemData.BOOLEANS[0].value,
  orderBy: ORDER_ITEMS[0].value,
  orderDir: SystemData.ORDERING[0].value,
  rowLimit: SystemData.ROW_LIMITS[0],
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelOpen: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      orderByItems: ORDER_ITEMS,
      orderDirItems: SystemData.ORDERING,
      rowLimitItems: SystemData.ROW_LIMITS,
      booleanItems: SystemData.BOOLEANS,
      baseSearchForm,
      loading: false,
    };
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { name: '', queue: '200px', profile: '120px', parked: '70px', action: '70px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { name: '', queue: '30%', profile: '15%', parked: '7%', action: '7%' },
          };
        }
      }
    },
  },
  methods: {
    applyOptions() {
      this.filterPanelOpen = false;
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

      delete this.searchForm.parked;
      delete this.searchForm.blocked;
      if (this.searchForm.parkStatus && this.searchForm.parkStatus != 'ALL') this.searchForm.parked = this.searchForm.parkStatus.toLowerCase();
      if (this.searchForm.blockStatus && this.searchForm.blockStatus != 'ALL') this.searchForm.blocked = this.searchForm.blockStatus.toLowerCase();

      SU_PlatformService.search(this.searchForm)
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
      this.filterPanelOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    openUpdateDialog(platform) {
      this.$refs.platformDialog.open(platform);
    },
    async update(platform) {
      const result = await SU_PlatformService.update(platform);
      if (result) {
        this.$refs.platformDialog.close();
        this.search();
      }
    },
    toggleParked(id) {
      SU_PlatformService.toggleParked(id).then((res) => {
        if (res) this.search();
      });
    },
    toggleBlocked(id) {
      SU_PlatformService.toggleBlocked(id).then((res) => {
        if (res) this.search();
      });
    },
    findRowColor(platform) {
      if (platform.parked == true && platform.blocked == true) {
        return 'background-color: orange';
      } else if (platform.parked == true) {
        return 'background-color: lightcyan';
        } else if (platform.blocked == true) {
        return 'background-color: pink';
      }
      return '';
    }
  },
  mounted() {
    this.search();
  },
  watch: {
    'searchForm.term'() {
      return this.search();
    },
  },
  components: {
    Edit: () => import('./Edit.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
