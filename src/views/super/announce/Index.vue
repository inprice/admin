<template>

  <div>
    <div>
      <div class="title">Announcements</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">

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
                  
                  <v-divider class="py-2"></v-divider>

                  <v-select
                    autofocus
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
                    label="Type"
                    v-model="searchForm.types"
                    :items="typeItems"
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

                  <div class="d-flex mb-4">
                    <v-menu
                      v-model="startingAtMenuOpen"
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
                          v-model="searchForm.startingAt"
                          label="Starting At"
                          v-on="on"
                          v-bind="attrs"
                          class="pr-1"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        scrollable
                        v-model="searchForm.startingAt"
                        @input="startingAtMenuOpen = false"
                      ></v-date-picker>
                    </v-menu>

                    <v-menu
                      v-model="endingAtMenuOpen"
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
                          v-model="searchForm.endingAt"
                          label="Ending At"
                          v-on="on"
                          v-bind="attrs"
                          class="pl-1"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        no-title
                        scrollable
                        v-model="searchForm.endingAt"
                        @input="endingAtMenuOpen = false"
                      ></v-date-picker>
                    </v-menu>
                  </div>

                  <div class="d-flex justify-space-around mb-4">
                    <v-select
                      dense
                      outlined
                      hide-details
                      class="col pr-1"
                      label="Order By"
                      v-model="searchForm.orderBy"
                      :items="orderByItems"
                    ></v-select>

                    <v-select
                      dense
                      outlined
                      hide-details
                      class="col pl-1"
                      label="Order Dir"
                      v-model="searchForm.orderDir"
                      :items="orderDirItems"
                    ></v-select>
                  </div>

                  <v-select
                    dense
                    outlined
                    hide-details
                    label="Row Limit"
                    v-model="searchForm.rowLimit"
                    :items="rowLimitItems"
                    class="mb-2"
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

      <v-btn 
        small
        class="my-auto"
        @click="addAnAnnouncement"
        :disabled="$store.get('session/isNotSuperUser')"
      >
        New Announce
      </v-btn>
    </div>

    <div v-if="searchResult && searchResult.length" style="border: 1px solid #ddd">

      <div
        class="body-2"
        v-for="(row, index) in searchResult" :key="row.id"
      >
        <div  v-if="index==0">
            <v-row class="px-2 mx-0 font-weight-medium">
              <v-col cols="2" class="hidden-sm-and-down">
                Type
              </v-col>
              <v-col cols="2">
                Level
              </v-col>
              <v-col>
                Title
              </v-col>
              <v-col cols="2" class="text-right hidden-sm-and-down">
                Starting At
              </v-col>
              <v-col cols="2" class="text-right hidden-sm-and-down">
                Ending At
              </v-col>
              <v-btn
                small icon
                class="my-auto"
                disabled
              ></v-btn>
            </v-row>
          <v-divider></v-divider>
        </div>

        <div class="row-wrapper">
          <v-row class="px-2 mx-0" @click="toggleDetailPanel(row.id)">
            <v-col
              cols="2"
              class="font-weight-medium hidden-sm-and-down"
              :style="'color: ' + findTypeColor(row.type)"
            >
              {{ row.type }}
            </v-col>
            <v-col
              cols="2"
              class="font-weight-medium"
              :style="'color: ' + findLevelColor(row.level)"
            >
              {{ row.level }}
            </v-col>
            <v-col>
              {{ row.title }}
            </v-col>
            <v-col cols="2" class="text-right hidden-sm-and-down">
              {{ row.startingAt }}
            </v-col>
            <v-col cols="2" class="text-right hidden-sm-and-down">
              {{ row.endingAt }}
            </v-col>
          
            <v-menu offset-y bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small icon
                  class="my-auto"
                  v-bind="attrs"
                  v-on="on"
                  @click.stop=""
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item :disabled="isNotEditable(row)" @click="openEditDialog(row)">
                  <v-list-item-title>EDIT</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="isNotEditable(row)" @click="remove(row.id)">
                  <v-list-item-title>DELETE</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-row>

          <v-card
            tile
            class="ml-7 mb-2"
            style="border-left: 3px solid red; cursor: auto"
            v-if="showDetails == true && showingId == row.id"
          >
            <v-card-text v-html="row.body"></v-card-text>
          </v-card>

        </div>

        <v-divider></v-divider>

      </div>
    </div>

    <v-card v-else >
      <block-message :message="'No announce found! You can add a new one or change your criteria.'" />
    </v-card>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>

    <confirm ref="confirm"></confirm>
    <edit ref="editDialog" @saved="saved" />

  </div>

</template>

<script>
import SU_AnnounceService from '@/service/super/announce';
import moment from 'moment';

const searchByItems = ['TITLE', 'BODY'];
const typeItems = ['USER', 'ACCOUNT', 'SYSTEM'];
const levelItems = ['INFO', 'WARNING'];
const orderByItems = ['TITLE', 'TYPE', 'LEVEL', 'STARTING_AT', 'ENDING_AT', 'CREATED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  searchBy: searchByItems[0],
  types: null,
  levels: null,
  startingAt: null,
  endingAt: null,
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  rowLimit: rowLimitItems[0],
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      searchMenuOpen: false,
      startingAtMenuOpen: false,
      endingAtMenuOpen: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      showingId: 0,
      showDetails: false,
      searchByItems,
      typeItems,
      levelItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      baseSearchForm,
    };
  },
  methods: {
    addAnAnnouncement() {
      this.$refs.editDialog.open();
    },
    openEditDialog(ticket) {
      const cloned = JSON.parse(JSON.stringify(ticket));
      this.$refs.editDialog.open(cloned);
    },
    async saved(searchForm) {
      const result = await SU_AnnounceService.save(searchForm);
      if (result && result.status) this.search();
    },
    async remove(id) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This announce').then((confirm) => {
        if (confirm == true) {
          SU_AnnounceService.remove(id).then((res) => {
            if (res && res.status) this.search();
          });
        }
      });
    },
    toggleDetailPanel(id) {
      if (this.showingId == id) {
        this.showDetails = !this.showDetails;
      } else {
        this.showingId = id;
        this.showDetails = true;
      }
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
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
      }

      const loadMore = this.isLoadMoreClicked;
      this.isListLoading = true;
      this.isLoadMoreClicked = false;

      SU_AnnounceService.search(this.searchForm, true)
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
    isNotEditable(announce) {
      return moment(announce.endingAt).isBefore();
    },
    resetForm() {
      this.searchMenuOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
      this.$refs.term.focus();
    },
    findTypeColor(type) {
      switch (type) {
        case 'USER': return 'blue';
        case 'ACCOUNT': return 'green';
        case 'SYSTEM': return 'purple';
      }
      return 'grey';
    },
    findLevelColor(level) {
      switch (level) {
        case 'INFO': return 'teal';
        case 'WARNING': return 'red';
      }
      return 'grey';
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
    Edit: () => import('./Edit.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>

<style scoped>
  .row-wrapper .row:hover {
    background-color: #eee !important;
    cursor: pointer;
  }
  .col {
    padding: 6px !important;
  }

</style>