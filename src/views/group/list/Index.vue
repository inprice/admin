<template>

  <div>
    <div>
      <div class="title">Groups</div>
      <div class="body-2">Your groups.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">

      <div class="col-10 pl-0">
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

      <div class="py-3">
        <v-btn 
          :disabled="$store.get('session/isViewer')"
          elevation="2"
          @click="addNew">
            Add new
        </v-btn>
      </div>
    </div>

    <div class="col pa-0">
      <list :rows="searchResult" @edit="edit" :isLoading="isListLoading" />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
      </div>

      <edit ref="editDialog" @saved="search" />
    </div>

  </div>

</template>

<script>
import GroupService from '@/service/group';
import SystemConsts from '@/data/system';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  data() {
    return {
      searchTerm: '',
      searchResult: [],
      isListLoading: true,
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
      this.$router.push({ name: 'group', params: { id } });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    search() {
      const loadMore = this.isLoadMoreClicked;
      this.isListLoading = true;
      this.isLoadMoreClicked = false;

      GroupService.search(this.searchTerm)
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
            this.isLoadMoreDisabled = (res.length < SystemConsts.LIMITS.ROW_LIMIT_FOR_LISTS);
          }
      });
    }
  },
  watch: {
    searchTerm() {
      this.search();
    },
  },
  created() {
    this.search();
  },
  components: {
    List: () => import('./List'),
    Edit: () => import('../Edit'),
  },
}
</script>
