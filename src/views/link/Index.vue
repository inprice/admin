<template>

  <div>
    <div>
      <div class="title">Links</div>
      <div class="body-2">The list of your links bound to your groups.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between" v-if="CURSTAT.isActive || CURSTAT.linkCount > 0">

      <div class="col-10 pl-0 d-flex">
        <v-text-field 
          ref="term"
          autofocus
          outlined dense
          hide-details
          maxlength="100"
          v-model="searchForm.term"
          @keyup="isSearchable($event)"
          :label="searchForm.searchBy"
          :placeholder="'Search by ' + searchForm.searchBy"
        >
          <template v-slot:append>
            <v-menu
              offset-y
              bottom left
              v-model="menu"
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
                    <v-icon style="cursor: pointer" @click="menu = false">mdi-close</v-icon>
                  </div>
                  
                  <v-divider class="py-2 pb-4"></v-divider>

                  <v-select
                    autofocus
                    dense
                    label="Search By"
                    outlined
                    v-model="searchForm.searchBy"
                    :items="searchByItems"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Levels"
                    v-model="searchForm.levels"
                    :items="levelItems"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Statuses"
                      v-model="searchForm.statuses"
                    :items="statusItems"
                  ></v-select>

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

                  <v-select
                    dense
                    outlined
                    label="Row Limit"
                    v-model="searchForm.rowLimit"
                    :items="rowLimitItems"
                  ></v-select>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn outlined text @click="resetForm" tabindex="-1">
                    Reset
                  </v-btn>
                  <v-btn outlined text color="primary" @click="applyOptions">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>

            </v-menu>
          </template>
        </v-text-field>
      </div>

    </div>

    <div class="col pa-0" v-if="CURSTAT.planId">
      <list
        ref="list"
        :rows="searchResult"
        @refreshList="search"
      />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">Load More</v-btn>
      </div>
    </div>

    <v-card v-else>
      <block-message class="mt-2">
        You are not allowed to manage your products until activate your account!
        <div :class="'text-'+($vuetify.breakpoint.smAndDown ? 'center mt-2' : 'right float-right')">
          <v-btn 
            :disabled="$store.get('session/isViewer')"
            small
            color="success"
            class="my-auto"
            @click="$router.push( { name: 'plans' })">
              See Plans
          </v-btn>
        </div>
      </block-message>
    </v-card>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import { get } from 'vuex-pathify'

const searchByItems = ['Name', 'Seller', 'Brand', 'SKU', 'Platform'];
const levelItems = ['LOWEST', 'HIGHEST', 'LOWER', 'AVERAGE', 'HIGHER', 'EQUAL'];
const statusItems = ['WAITING', 'ACTIVE', 'TRYING', 'PROBLEM'];
const orderByItems = [...searchByItems, 'Level', 'Price', 'Last_Checked', 'Last_Updated'];
const orderDirItems = ['Ascending', 'Descending'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  levels: [],
  statuses: [],
  searchBy: searchByItems[0],
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      menu: false,
      searchResult: [],
      isListLoading: true,
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      searchByItems,
      levelItems,
      statusItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      baseSearchForm,
    };
  },
  methods: {
    applyOptions() {
      this.menu = false;
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

      LinkService.search(this.searchForm, true)
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
      this.menu = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
      this.$refs.term.focus();
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || char == 46 || (char > 64 && char < 91) || (char > 96 && char < 123)) {
        return this.search();
      }
    }
  },
  mounted() {
    this.search();
  },
  components: {
    List: () => import('./List'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
