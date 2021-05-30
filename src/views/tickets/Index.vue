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
          label="Issue"
          placeholder="Search for issue"
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
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Status"
                    v-model="searchForm.statuses"
                    :items="statusItems"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Priority"
                    v-model="searchForm.priorities"
                    :items="priorityItems"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Type"
                    v-model="searchForm.types"
                    :items="typeItems"
                  ></v-select>

                  <v-select
                    dense
                    small-chips
                    multiple
                    outlined
                    label="Subject"
                    v-model="searchForm.subjects"
                    :items="subjectItems"
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

                    <v-select
                      class="col ml-2"
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

      <v-btn 
        small
        class="my-auto"
        @click="addNew"
        :disabled="$store.get('session/isNotEditor')"
      >
        Add new
      </v-btn>
    </div>

    <div v-if="searchResult && searchResult.length">
      <ticket
        v-for="row in searchResult" :key="row.id"
        :ticket="row"
        :fromList="true" 
        @saved="saved"
        @removed="removed"
      />
    </div>

    <v-card v-else >
      <block-message :message="'No ticket found! You can add a new one or change your criteria.'" />
    </v-card>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>

    <edit ref="editDialog" @saved="saved" />

  </div>

</template>

<script>
import TicketService from '@/service/ticket';

const statusItems = ['OPENED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'WAITING_FOR_VERSION', 'CLOSED'];
const priorityItems = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
const typeItems = ['FEEDBACK', 'SUPPORT', 'PROBLEM'];
const subjectItems = ['SUBSCRIPTION', 'PAYMENT', 'LINK', 'GROUP', 'ACCOUNT', 'COUPON', 'OTHER'];
const orderByItems = ['STATUS', 'PRIORITY', 'TYPE', 'SUBJECT', 'CREATED_AT'];
const orderDirItems = ['ASC', 'DESC'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  statuses: null,
  priorities: null,
  types: null,
  subjects: null,
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
      statusItems,
      priorityItems,
      typeItems,
      subjectItems,
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
    async saved(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.search();
    },
    async removed(id) {
      const result = await TicketService.remove(id);
      if (result && result.status) this.search();
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
    Ticket: () => import('./Ticket.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>

<style scoped>
  .shorten-text {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
</style>