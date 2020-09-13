<template>

  <div>
    <div class="display-1">
      Products
    </div>
    <p class="subtitle">
      In this section, you can manage your products you want to monitor.
    </p>
    <v-divider></v-divider>

    <!-- ------ -->
    <!-- Search -->
    <!-- ------ -->
    <div class="d-flex justify-space-between pt-2">
      <v-text-field 
        ref="searchField"
        v-model="search.term"
        @keyup.enter.native="search"
        dense solo light
        class="col-8"
        maxlength="100"
        hide-details
        placeholder="Search by Name">
          <template slot="append">
            <v-icon @click="clear">mdi-window-close</v-icon>
          </template>
      </v-text-field>

      <v-spacer></v-spacer>

      <v-btn 
        dark
        color="success"
        @click="addNew">
          Add Product
      </v-btn>
    </div>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex">
      <div class="col-2 pl-0 pr-1">

        <!-- Positions -->
        <v-card>
          <div class="group-header">POSITION</div>
          <v-card-text class="pa-2 caption">
            <v-radio-group
              v-model="search.position" 
              dense
              hide-details
            >
              <v-radio label="ALL" :value="-1" />
              <v-radio v-for="pos in positions" :key="pos.value"
                :label="pos.text"
                :value="pos.value"
                class="mb-0"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Brands -->
        <v-card class="mt-4" :style="'max-height:' + findMaxHeight('brand', 1) + 'px;'">
          <div class="group-header">Brand</div>
          <v-card-text class="pa-2 my-auto" :style="'max-height:' + findMaxHeight('brand', 2) + 'px; overflow-y: auto;'">
            <v-radio-group 
              v-model="search.brand" 
              dense
              hide-details
            >
              <v-radio label="ALL" :value="-1" />
              <v-radio v-for="brnd in brands" :key="brnd.key"
                :label="brnd.value"
                :value="brnd.key"
                class="mb-0"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Categories -->
        <v-card class="mt-4" :style="'max-height:' + findMaxHeight('brand', 1) + 'px;'">
          <div class="group-header">Category</div>
          <v-card-text class="pa-2 my-auto" :style="'max-height:' + findMaxHeight('category', 2) + 'px; overflow-y: auto;'">
            <v-radio-group 
              v-model="search.category" 
              dense
              hide-details
            >
              <v-radio label="ALL" :value="-1" />
              <v-radio v-for="cat in categories" :key="cat.key"
                :label="cat.value"
                :value="cat.key"
                class="mb-0"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

      </div>

      <div class="col px-1">
        
        <list :rows="searchResult" />

        <div class="mt-3">
          <v-btn @click="loadmore" :disabled="!isLoadMoreEnabled">Load More</v-btn>
      </div>
      </div>
    </div>

    <edit ref="editDialog" @saved="search" />

  </div>

</template>

<script>
import ProductService from '@/service/product';
import LookupService from '@/service/lookup';
import SystemConsts from '@/data/system';

export default {
  data() {
    return {
      search: {
        term: null,
        position: -1,
        brand: -1,
        category: -1,
      },
      searchResult: [],
      brands: [],
      categories: [],
      isLoadMoreEnabled: false,
    };
  },
  computed: {
    positions() {
      return SystemConsts.POSITIONS;
    },
  },
  methods: {
    clear() {
      this.search.term = '';
    },
    addNew() {
      this.$refs.editDialog.open();
    },
    loadmore() {
      console.log('Load more pressed');
    },
    findMaxHeight(group, level) {
      let val = 350;
      if (group != 'brand') {
        val = 500;
      }
      if (level == 1) return val;
      if (level == 2) return val-30;
    }
  },
  watch: {
    'search': {
      handler: function (val) {
        ProductService.search(val)
          .then((res) => {
            this.searchResult = res;
        });
      },
      deep: true
    },
  },
  mounted() {
    LookupService.getAllList()
      .then((res) => {
        this.brands = res.data.BRAND;
        this.categories = res.data.CATEGORY;
        this.search.term = ''; //triggers search mechanism
    });
  },
  components: {
    Edit: () => import('../definition/Edit'),
    List: () => import('./List'),
  },
}
</script>

<style scoped>
  .group-header {
    color: white;
    font-size: 85%;
    font-weight: bold;
    background-color: #607D8F;
    text-transform: uppercase;
    text-align: center;
  }
  .v-input--selection-controls {
    margin-top: 0;
  }
  .v-radio >>> label {
    font-size: 90%;
  }
  .v-item--active {
    font-weight: bold;
    background-color: beige;
  }
</style>