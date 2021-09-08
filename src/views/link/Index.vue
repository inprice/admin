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
    <div v-if="CURSTAT.planId">

      <div class="col-10 pl-0 d-flex">
        <v-text-field 
          ref="term"
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
                <v-card-text class="pb-2">
                  <div class="subtitle-1 pb-1 d-flex justify-space-between">
                    <span>Search Options</span>
                    <v-btn
                      icon
                      @click="searchMenuOpen = false"
                      tabindex="-1"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </div>
                  
                  <v-divider class="pb-2"></v-divider>

                  <v-select
                    dense
                    outlined
                    hide-details
                    label="Search By"
                    v-model="searchForm.searchBy"
                    :items="searchByItems"
                    class="mb-4"
                  ></v-select>

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

    </div>
    
    <div class="col pa-0" v-if="CURSTAT.planId">
      <list
        ref="list"
        :loading="listLoading"
        :rows="searchResult"
        @refreshList="search"
      />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length">Load More</v-btn>
      </div>
    </div>

    <v-card v-else>
      <block-message class="mt-2">
        You are not allowed to manage your products until activate your account!
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

  </div>

</template>

<script>
import LinkService from '@/service/link';
import { get } from 'vuex-pathify'

const searchByItems = ['NAME', 'SELLER', 'BRAND', 'SKU', 'PLATFORM'];
const levelItems = ['LOWEST', 'HIGHEST', 'LOWER', 'AVERAGE', 'HIGHER', 'EQUAL'];
const statusItems = ['ACTIVE', 'WAITING', 'TRYING', 'PROBLEM'];
const orderByItems = [...searchByItems, 'LEVEL', 'PRICE', 'CHECKED_AT', 'UPDATED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const alarmItems = ['ALL', 'ALARMED', 'NOT_ALARMED'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  levels: [],
  statuses: [],
  searchBy: searchByItems[0],
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
      searchMenuOpen: false,
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
      alarmItems,
      baseSearchForm,
      listLoading: true,
    };
  },
  methods: {
    applyOptions() {
      this.searchMenuOpen = false;
      this.search();
      this.$refs.term.focus();
    },
    search() {
      this.listLoading = true;
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

      LinkService.search(this.searchForm)
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
      }).finally(() => this.listLoading = false);
    },
    resetForm() {
      this.searchMenuOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
      this.$refs.term.focus();
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
    }
  },
  components: {
    List: () => import('./List.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
