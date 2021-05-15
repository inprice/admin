<template>

  <div>
    <div>
      <div class="title">Tickets</div>
      <div class="body-2">The tickets opened by your users.</div>
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
          @keyup="isSearchable($event)"
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
                    label="Search By"
                    outlined
                    v-model="searchForm.searchBy"
                    :items="searchByItems"
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

                  <div class="d-flex justify-space-around">
                    <v-select
                      class="col mr-2"
                      dense
                      outlined
                      label="Replied ?"
                      v-model="searchForm.replied"
                      :items="repliedItems"
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

      <v-btn 
        text outlined
        class="my-auto"
        @click="addNew"
        :disabled="$store.get('session/isNotEditor')"
      >
        Add new
      </v-btn>
    </div>

    <div class="col pa-0" v-if="searchResult && searchResult.length">
      <ticket
        v-for="row in searchResult" :key="row.id" 
        :ticket="row"
        :showDetails="isExpanded(row.id)"
        @toggled="toggleDetails(row.id)"
        @update="openEditDialog(row)"
        @rate="openCSatDialog(row)"
        @removed="removed"
      />
    </div>

    <v-card v-else >
      <block-message :message="'No ticket found! You can add a new one or change your criteria.'" />
    </v-card>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>

    <edit ref="editDialog" @saved="saveNew" />
    <c-sat-dialog ref="csatDialog" @saved="saveCSat" />

  </div>

</template>

<script>
import TicketService from '@/service/ticket';

const searchByItems = ['TYPE', 'SUBJECT', 'QUERY', 'REPLY'];
const repliedItems = ['ALL', 'REPLIED', 'NOT_REPLIED'];
const orderByItems = ['TYPE', 'SUBJECT', 'CREATED_AT', 'REPLIED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  replied: repliedItems[0],
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
      searchMenuOpen: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      showingId: 0,
      showDetails: false,
      searchByItems,
      repliedItems,
      orderByItems,
      orderDirItems,
      rowLimitItems,
      baseSearchForm,
    };
  },
  methods: {
    toggleDetails(id) {
      if (this.showingId != id) {
        this.showingId = id;
        this.showDetails = true;
      } else {
        this.showDetails = !this.showDetails;
      }
    },
    isExpanded(id) {
      return this.showingId==id && this.showDetails;
    },
    addNew() {
      this.$refs.editDialog.open();
    },
    openEditDialog(ticket) {
      const cloned = JSON.parse(JSON.stringify(ticket));
      this.$refs.editDialog.open(cloned);
    },
    openCSatDialog(ticket) {
      const form = {
        id: ticket.id,
        level: ticket.csatLevel,
        assessment: ticket.csatAssessment
      };
      this.$refs.csatDialog.open(form);
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

      TicketService.search(this.searchForm, true)
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
    async saveNew(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.search();
    },
    async saveCSat(form) {
      const result = await TicketService.saveCSat(form);
      if (result && result.status) this.search();
    },
    async removed() {
      const result = await TicketService.remove(this.ticket.id);
      if (result && result.status) this.search();
    },
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || char == 46 || (char > 64 && char < 91) || (char > 96 && char < 123)) {
        return this.search();
      }
    },
  },
  watch: {
    searchTerm() {
      this.search();
    },
  },
  mounted() {
    this.search();
  },
  components: {
    Edit: () => import('./Edit.vue'),
    CSatDialog: () => import('./CSatDialog.vue'),
    Ticket: () => import('./Ticket.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
