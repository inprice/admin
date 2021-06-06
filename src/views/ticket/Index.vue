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
          placeholder="Search by issue"
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
                    <v-btn
                      text
                      @click="resetForm"
                      tabindex="-1"
                    >
                      Reset
                    </v-btn>
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
                      label="Seen ?"
                      v-model="searchForm.seen"
                      :items="seenItems"
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
                      class="col ml-2"
                      dense
                      outlined
                      label="Order Dir"
                      v-model="searchForm.orderDir"
                      :items="orderDirItems"
                    ></v-select>
                  </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions class="justify-end">
                  <v-btn
                    text
                    @click="searchMenuOpen = false"
                    tabindex="-1"
                  >
                    Close
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
        @click="openTicket"
        :disabled="$store.get('session/isNotEditor')"
      >
        Open a Ticket
      </v-btn>
    </div>

    <div v-if="searchResult && searchResult.length">
      <v-card
        class="my-4 pa-4"
        :class="{ 'elevation-10': !row.seenByUser}"
        v-for="row in searchResult" :key="row.id"
      >
        <div class="d-flex justify-space-between mb-1">
          <div
            class="body-2 text-truncate"
            :class="{ 'font-weight-bold': !row.seenByUser}"
            style="cursor: pointer"
            @click="openDetails(row.id)"
          >
            <v-icon color="green" class="mr-2" v-if="!row.seenByUser">mdi-alert-rhombus</v-icon>
            {{ row.body }}
          </div>

          <div>
            <v-btn
              small text
              outlined
              class="mr-1"
              @click="openDetails(row.id)"
            >
              Details
            </v-btn>

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
                <v-list-item @click="copyTheContent(row.body)">
                  <v-list-item-title>COPY</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="openEditDialog(row)">
                  <v-list-item-title>EDIT</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="row.status != 'OPENED'" @click="remove(row.id)">
                  <v-list-item-title>DELETE</v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item @click="toggleSeenValue(row)">
                  <v-list-item-title>MARK AS {{ row.seenByUser ? 'UN' : '' }}SEEN</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div class="d-flex justify-space-between">
          <div>
            <v-chip
              small
              dark
              label
              outlined
              class="mr-1 font-weight-medium"
              :color="findStatusColor(row.status)"
            >
              {{ row.status }}
            </v-chip>

            <v-chip
              small
              dark
              label
              outlined
              class="mx-1 font-weight-medium"
              :color="findPriorityColor(row.priority)"
            >
              {{ row.priority }}
            </v-chip>

            <v-chip
              small
              dark
              label
              outlined
              class="mx-1 font-weight-medium"
              :color="findTypeColor(row.type)"
            >
              {{ row.type }}
            </v-chip>

            <v-chip
              small
              dark
              label
              outlined
              class="mx-1 font-weight-medium"
              color="teal"
            >
              {{ row.subject }}
            </v-chip>
          </div>

          <div class="caption text-right" >
            <span>Created at</span> <ago class="d-inline font-weight-medium" :date="row.createdAt" />
          </div>
        </div>
      </v-card>
    </div>

    <v-card v-else >
      <block-message :message="'No ticket found! You can add a new one or change your criteria.'" />
    </v-card>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>

    <confirm ref="confirm"></confirm>
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
const seenItems = ['ALL', 'SEEN', 'NOT_SEEN'];
const rowLimitItems = [25, 50, 100];

const baseSearchForm = {
  term: '',
  statuses: null,
  priorities: null,
  types: null,
  subjects: null,
  orderBy: orderByItems[0],
  orderDir: orderDirItems[0],
  seen: seenItems[0],
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
      seenItems,
      rowLimitItems,
      baseSearchForm,
    };
  },
  methods: {
    openTicket() {
      this.$refs.editDialog.open();
    },
    openEditDialog(ticket) {
      const cloned = JSON.parse(JSON.stringify(ticket));
      this.$refs.editDialog.open(cloned);
    },
    async saved(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.search();
    },
    async remove(id) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', 'This ticket').then((confirm) => {
        if (confirm == true) {
          TicketService.remove(id).then((res) => {
            if (res && res.status) this.search();
          });
        }
      });
    },
    toggleSeenValue(row) {
      TicketService.toggleSeenValue(row.id).then((res) => {
        if (res && res.status) row.seenByUser = !row.seenByUser;
      });
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
    openDetails(id) {
      this.$router.push({ name: 'ticket-detail', params: { ticketId: id } });
    },
    resetForm() {
      this.searchMenuOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
      this.$refs.term.focus();
    },
    copyTheContent(text) {
      this.copyToClipboard(text);
      this.$store.commit('snackbar/setMessage', { text: 'Issue copied', centered: true, color: 'cyan', timeout: 1100, closeButton: false });
    },
    findStatusColor(status) {
      switch (status) {
        case 'OPENED': return 'blue lighten-2';
        case 'IN_PROGRESS': return 'green lighten-2';
        case 'WAITING_FOR_USER': return 'orange lighten-2';
        case 'WAITING_FOR_VERSION': return 'cyan lighten-2';
        case 'CLOSED': return 'red lighten-2';
      }
      return 'gray';
    },
    findPriorityColor(priority) {
      switch (priority) {
        case 'LOW': return 'green lighten-2';
        case 'NORMAL': return 'blue lighten-2';
        case 'HIGH': return 'pink lighten-2';
        case 'CRITICAL': return 'red lighten-2';
      }
      return 'gray';
    },
    findTypeColor(type) {
      switch (type) {
        case 'FEEDBACK': return 'blue lighten-2';
        case 'SUPPORT': return 'green lighten-2';
        case 'PROBLEM': return 'pink lighten-2';
      }
      return 'gray';
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
