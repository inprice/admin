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

      <div class="col-8 pl-0">
        <v-text-field 
          autofocus
          v-model="searchTerm"
          @keyup.enter.native="search"
          dense solo light
          maxlength="100"
          hide-details
          placeholder="Search by Name">
            <template slot="append">
              <v-icon @click="clear">mdi-window-close</v-icon>
            </template>
        </v-text-field>
      </div>

      <div class="my-auto">
        <v-btn 
          small
          :disabled="$store.get('session/isViewer')"
          @click="addNew">
            Add new
        </v-btn>
      </div>
    </div>

    <div class="col pa-0">
      <div v-if="searchResult && searchResult.length">
        <ticket
          :ticket="row"
          :fromSearchPage="true"
          v-for="(row, index) in searchResult" :key="row.id" 
          @saved="refresh(index, $event)"
          @linksAdded="refresh(index, $event)"
          @removed="removed(index)"
        />
      </div>

      <v-card v-else >
        <block-message :message="'No ticket found! You can add a new one or change your criteria.'" />
      </v-card>

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
      </div>
    </div>

    <edit ref="editDialog" @saved="saveNew" />

  </div>

</template>

<script>
import TicketService from '@/service/ticket';
import SystemConsts from '@/data/system';

export default {
  data() {
    return {
      searchTerm: '',
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
    };
  },
  methods: {
    clear() {
      this.searchTerm = '';
    },
    addNew() {
      this.$refs.editDialog.open();
    },
    edit(id) {
      this.$router.push({ name: 'ticket', params: { id } });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    search() {
      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      TicketService.search(this.searchTerm)
        .then((res) => {
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
            this.isLoadMoreDisabled = (res.length < SystemConsts.LIMITS.ROW_LIMIT_FOR_LISTS);
          }
      });
    },
    async saveNew(form) {
      const result = await TicketService.save(form);
      if (result && result.status) this.search();
    },
    refresh(index, result) {
      if (this.searchResult && result.ticket && this.searchResult.length > index) {
        //Vue cannot sense of any change in array when we directly set the index or change the length!
        this.$set(this.searchResult, index, result.ticket);
      } else {
        this.search();
      }
    },
    removed(index) {
      if (this.searchResult && this.searchResult.length > index) {
        this.searchResult.splice(index, 1);
        if (!this.searchResult || !this.searchResult.length) this.search();
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
    Ticket: () => import('./Ticket.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
