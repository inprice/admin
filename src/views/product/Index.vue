<template>

  <div>
    <div class="title">Products</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <div class="col-6 pl-0">
        <v-text-field 
          :loading="loading"
          v-model="searchForm.term"
          @keyup="isSearchable($event)"
          dense solo
          maxlength="100"
          hide-details
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
        >
        </v-text-field>
      </div>

      <v-btn 
        color="white"
        class="my-auto"
        @click="addNew"
        :disabled="$store.get('session/isNotEditor')"
      >
        Add
      </v-btn>
    </div>

    <v-card tile v-if="searchResult && searchResult.length">
      <table class="list-table">
        <thead>
          <tr>
            <th width="3%"></th>
            <th class="text-left">Name</th>
            <th width="10%" class="text-right">Price</th>
            <th width="7%" class="text-right hidden-sm-and-down">Links</th>
            <th width="10%" class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in searchResult" :key="row.id" 
            style="cursor: pointer"
            @click="$router.push({ name: 'product', params: { id: row.id } })"
          >
            <td class="text-right pr-0">
              <v-icon 
                style="font-size:18px"
                :color="findLevelColor(row.level)"
              >
                mdi-star
              </v-icon>
            </td>
            <td>{{ row.name }}</td>
            <td class="text-right">{{ (row.price || 0) | toPrice }}</td>
            <td class="text-right hidden-sm-and-down">{{ row.linkCount }}</td>
            <td class="text-right">{{ (row.total || 0) | toPrice }}</td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <div class="pa-3 pr-0 text-right" v-if="searchResult && searchResult.length">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length">More</v-btn>
    </div>

    <v-card v-else-if="!loading" >
      <block-message 
        :message="'No product found! You can add a new one or change your criteria.'" 
      />
    </v-card>

    <edit ref="editDialog" @saved="saveNew" />

  </div>

</template>

<script>
import ProductService from '@/service/product';
import SystemConsts from '@/data/system';
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      searchForm: {
        term: '',
        rowCount: 0,
        loadMore: false
      },
      loading: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
    };
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    addNew() {
      this.$refs.editDialog.open();
    },
    edit(id) {
      this.$router.push({ name: 'product', params: { id } });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
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

      ProductService.search(this.searchForm)
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
            this.isLoadMoreDisabled = (res.length < SystemConsts.LIMITS.ROW_LIMIT_FOR_LISTS);
          }
      }).finally(() => this.loading = false);
    },
    async saveNew(form) {
      const result = await ProductService.save(form);
      if (result && result.status) this.search();
    },
    refresh(index, result) {
      if (this.searchResult && result.product && this.searchResult.length > index) {
        //Vue cannot sense of any change in array when we directly set the index or change the length!
        this.$set(this.searchResult, index, result.product);
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
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || char == 46 || (char > 47 && char < 91) || (char > 96 && char < 123)) {
        return this.search();
      }
    },
  },
  watch: {
    searchForm() {
      this.search();
    },
  },
  mounted() {
    this.search();
  },
  components: {
    Edit: () => import('./Edit.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
