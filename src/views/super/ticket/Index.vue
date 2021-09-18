<template>

  <div>
    <div>
      <div class="title">Tickets for Super User</div>
      <div class="body-2">The tickets opened by your users.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="col-6 pl-0 d-flex">
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
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="Status"
                  v-model="searchForm.statuses"
                  :items="statusItems"
                  class="mb-4"
                ></v-select>

                <v-select
                  dense
                  small-chips
                  multiple
                  outlined
                  hide-details
                  label="Priority"
                  v-model="searchForm.priorities"
                  :items="priorityItems"
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
                  label="Subject"
                  v-model="searchForm.subjects"
                  :items="subjectItems"
                  class="mb-4"
                ></v-select>

                <div class="d-flex justify-space-around mb-4">
                  <v-select
                    dense
                    outlined
                    hide-details
                    class="pr-1"
                    label="Seen ?"
                    v-model="searchForm.seen"
                    :items="seenItems"
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

                <div class="d-flex justify-space-around mb-2">
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

    <div v-if="searchResult && searchResult.length">
      <v-card
        class="my-4 pa-4"
        :class="{ 'elevation-3': !row.seenBySuper}"
        v-for="row in searchResult" :key="row.id"
      >
        <div class="d-flex justify-space-between mb-1">
          <div
            class="body-2 text-truncate"
            :class="{ 'font-weight-bold': !row.seenBySuper}"
            style="cursor: pointer"
            @click="openDetails(row.id)"
          >
            <div class="caption font-weight-light">{{ row.account }}</div>
            <v-icon color="green" class="mr-2" v-if="!row.seenBySuper">mdi-alert-rhombus</v-icon>
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

                <v-list-item @click="toggleSeenValue(row)">
                  <v-list-item-title>MARK AS {{ row.seenBySuper ? 'UN' : '' }}SEEN</v-list-item-title>
                </v-list-item>

                <v-list-group
                  no-action
                  :value="false"
                  @click.stop=""
                >
                  <template v-slot:activator>
                    <v-list-item-title>CHANGE STATUS</v-list-item-title>
                  </template>

                  <v-list-item
                    link
                    v-for="(status, i) in statusItemsWOOpened" :key="i"
                    :disabled="row.status == status"
                    @click="changeStatus(row.id, status)"
                  >
                    <v-list-item-title link v-text="status.replaceAll('_', ' ')"></v-list-item-title>
                  </v-list-item>
                </v-list-group>
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
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">More</v-btn>
    </div>

    <edit ref="editDialog"></edit>

  </div>

</template>

<script>
import SU_TicketService from '@/service/super/ticket';

const statusItems = ['OPENED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'WAITING_FOR_VERSION', 'CLOSED'];
const priorityItems = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];
const typeItems = ['FEEDBACK', 'SUPPORT', 'PROBLEM'];
const subjectItems = ['SUBSCRIPTION', 'PAYMENT', 'LINK', 'PRODUCT', 'ACCOUNT', 'COUPON', 'OTHER'];
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
      filterPanelOpen: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      showingId: 0,
      showDetails: false,
      statusItems,
      statusItemsWOOpened: statusItems,
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
    async changeStatus(id, newStatus) {
      const result = await SU_TicketService.changeStatus({ id, status: newStatus});
      if (result && result.status) this.search();
    },
    toggleSeenValue(row) {
      SU_TicketService.toggleSeenValue(row.id).then((res) => {
        if (res && res.status) row.seenBySuper = !row.seenBySuper;
      });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
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
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      SU_TicketService.search(this.searchForm, true)
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
    openDetails(id) {
      this.$router.push({ name: 'sys-ticket-details', params: { ticketId: id } });
    },
    resetForm() {
      this.filterPanelOpen = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
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
    Edit: () => import('../../ticket/Edit.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
