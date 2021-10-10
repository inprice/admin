<template>

  <div>
    <div class="title">Products</div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <div 
        class="pl-0 d-flex"
        :class="$vuetify.breakpoint.name == 'xs' ? 'col-10' : 'col-6'"
      >
        <v-text-field 
          :loading="loading"
          v-model="searchForm.term"
          @keyup="isSearchable($event)"
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
                  <div class="body-1 pb-2 d-flex justify-space-between">
                    <span class="my-auto">Filters</span>
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
                    label="Positions"
                    class="mb-4"
                    v-model="searchForm.positions"
                    :items="positionItems"
                    item-text="text"
                    item-value="value"
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    label="Brand"
                    v-model="searchForm.brand"
                    :items="brands"
                    item-text="name"
                    return-object
                  ></v-select>

                  <v-select
                    dense
                    outlined
                    label="Category"
                    v-model="searchForm.category"
                    :items="categories"
                    item-text="name"
                    return-object
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
                      item-text="text"
                      item-value="value"
                    ></v-select>

                    <v-select
                      dense
                      outlined
                      hide-details
                      class="pl-1"
                      label="Order Dir"
                      v-model="searchForm.orderDir"
                      :items="orderDirItems"
                      item-text="text"
                      item-value="value"
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
                      item-text="text"
                      item-value="value"
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

                  <v-divider class="mt-3"></v-divider>

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
                      Apply
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
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
        Add New
      </v-btn>
    </div>

    <v-card tile v-if="searchResult && searchResult.length">
      <table class="list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th width="7%" class="hidden-sm-and-down">Brand</th>
            <th width="7%" class="hidden-sm-and-down">Category</th>
            <th width="10%" class="text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in searchResult" :key="row.id" 
            style="cursor: pointer"
            @click="$router.push({ name: 'product', params: { id: row.id } })"
          >
            <td>
              <div class="caption teal--text font-weight-medium">{{ row.sku }}</div>
              <div>{{ row.name }}</div>
            </td>
            <td class="hidden-sm-and-down">{{ row.brandName }}</td>
            <td class="hidden-sm-and-down">{{ row.categoryName }}</td>
            <td class="align-center">
              <div class="d-flex justify-end my-auto">
                <div class="mr-1">
                  {{ (row.price || 0) | toPrice }}
                </div>
                <v-icon 
                  class="hidden-xs-only"
                  :color="row.alarmId ? '' : 'transparent'" 
                  style="font-size:20px"
                >
                  mdi-alarm
                </v-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <div class="pa-3 pr-0 text-right" v-if="searchResult && searchResult.length">
      <v-btn 
        small
        @click="loadmore" 
        :disabled="isLoadMoreDisabled" 
        v-if="searchResult.length > 0"
      >
        More
      </v-btn>
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
import BrandService from '@/service/brand';
import CategoryService from '@/service/category';
import SystemConsts from '@/data/system';
import { get } from 'vuex-pathify'

import SystemData from '@/data/system';

const ORDER_ITEMS = [
  { text: 'Name', value: 'NAME' },
  { text: 'Sku', value: 'SKU' },
  { text: 'Brand', value: 'BRAND' },
  { text: 'Category', value: 'CATEGORY' }
];

const baseSearchForm = {
  term: '',
  positions: [],
  brand: null,
  category: null,
  orderBy: ORDER_ITEMS[0].value,
  orderDir: SystemData.ORDERING[0].value,
  rowLimit: SystemData.ROW_LIMITS[0],
  alarmStatus: SystemData.ALARM_STATES[0].value,
  rowCount: 0,
}

export default {
  data() {
    return {
      searchForm: JSON.parse(JSON.stringify(baseSearchForm)),
      filterPanelShow: false,
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
      positionItems: SystemData.POSITIONS,
      orderByItems: ORDER_ITEMS,
      orderDirItems: SystemData.ORDERING,
      rowLimitItems: SystemData.ROW_LIMITS,
      alarmItems: SystemData.ALARM_STATES,
      baseSearchForm,
      brands: [],
      categories: [],
      loading: false,
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
    applyOptions() {
      this.filterPanelShow = false;
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
      if (result && result.status) {
        this.$refs.editDialog.close();
        this.search();
      }
    },
    resetForm() {
      this.filterPanelShow = false;
      this.searchForm = JSON.parse(JSON.stringify(baseSearchForm));
      this.search();
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
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
    BrandService.getList().then((res) => {
      if (res && res.data) {
        this.brands = res.data;
      }
    });
    CategoryService.getList().then((res) => {
      if (res && res.data) {
        this.categories = res.data;
      }
    });
  },
  components: {
    Edit: () => import('./Edit.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
}
</script>
