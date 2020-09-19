<template>

  <div>
    <div class="display-1">
      Products
    </div>
    <p class="subtitle">
      In this section, you can manage your products you want to monitor.
    </p>
    <v-divider></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between mt-4">

      <div class="col-10 d-flex px-1 py-0">
        <v-text-field 
          ref="searchField"
          v-model="search.term"
          @keyup.enter.native="search"
          dense solo light
          maxlength="100"
          hide-details
          placeholder="Search by Name">
            <template slot="append">
              <v-icon @click="clear">mdi-window-close</v-icon>
            </template>
        </v-text-field>

        <v-btn 
          dark
          fab small
          class="ml-2"
          color="success"
          @click="addNew">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        bottom left
        transition="slide-x-transition"
      >

        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            class="col-1" 
            v-bind="attrs"
            v-on="on"
          >
            Filters
          </v-btn>
        </template>        

        <v-card class="altlik-card">
          <!-- Positions -->
          <v-card class="ma-2" tile>
            <v-list dense>  
              <v-list-item-group v-model="search.position">
                <v-list-item
                  v-for="itm in positions"
                  :key="itm.key"
                >
                  <v-list-item-content>
                    <v-list-item-title :class="'font-weight-' + (itm.key == 0 ? 'bold' : 'regular')" v-text="itm.value"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>

          <!-- Brands -->
          <v-card class="ma-2" tile>
            <v-list dense>  
              <v-list-item-group v-model="search.brand">
                <v-list-item
                  v-for="itm in brands"
                  :key="itm.key"
                >
                  <v-list-item-content>
                    <v-list-item-title :class="'font-weight-' + (itm.key == 0 ? 'bold' : 'regular')" v-text="itm.value"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>

          <v-card class="ma-2" tile>
            <v-list dense>  
              <v-list-item-group v-model="search.category">
                <v-list-item
                  v-for="itm in categories"
                  :key="itm.key"
                >
                  <v-list-item-content>
                    <v-list-item-title :class="'font-weight-' + (itm.key == 0 ? 'bold' : 'regular')" v-text="itm.value"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-card>

      </v-menu>

    </div>

    <div class="col px-1">
      <list :rows="searchResult" @edit="edit" />
      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">Load More</v-btn>
      </div>
    </div>

    <edit ref="editDialog" @saved="refreshAll" />

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
        term: '',
        position: 0,
        brand: 0,
        category: 0,
        counter: 0 //used for trigger search mechanism when update or add a new product (look at edit tag above)
      },
      menu: false,
      searchResult: [],
      positions: [],
      brands: [],
      categories: [],
      isLoadMoreDisabled: false,
      isLoadMoreClicked: false,
    };
  },
  methods: {
    clear() {
      this.search.term = '';
    },
    addNew() {
      this.$refs.editDialog.open();
    },
    edit(id) {
      this.$router.push({ name: 'product', params: { id } });
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.triggerSearch();
    },
    refreshAll() {
      LookupService.getAllList()
        .then((res) => {
          if (res && res.data) {
            this.positions = [{ key: 0, value: 'ALL POSITIONS' }, ...res.data.POSITIONS];
            this.brands = [{ key: 0, value: 'ALL BRANDS' }, ...res.data.BRAND];
            this.categories = [{ key: 0, value: 'ALL CATEGORIES' }, ...res.data.CATEGORY];
            this.triggerSearch();
          }
      });
    },
    triggerSearch() {
      ++this.search.counter; //triggers search call to the server
    }
  },
  watch: {
    'search': {
      handler: function (form) {
        //we have to clone it since search form is sensitive for changes.
        //any direct change on search form cause an endless loop for this method!
        const cloneForm = JSON.parse(JSON.stringify(form));
        if (form.position && form.position > 1) cloneForm.position = this.positions[form.position].key;
        if (form.brand && this.brands?.length) cloneForm.brand = this.brands[form.brand].key;
        if (form.category && this.categories?.length) cloneForm.category = this.categories[form.category].key;
        //clicking load more is a different case
        if (this.isLoadMoreClicked == true && this.searchResult.length) {
          cloneForm.rowCount = this.searchResult.length;
          cloneForm.loadMore = this.isLoadMoreClicked;
        }

        const loadMore = this.isLoadMoreClicked;
        this.isLoadMoreClicked = false;

        ProductService.search(cloneForm, true)
          .then((res) => {
            this.isLoadMoreDisabled = true;
            if (res?.length) {
              if (loadMore == true) {
                this.searchResult = this.searchResult.concat(res);
              } else {
                this.searchResult = res;
              }
              this.isLoadMoreDisabled = (res.length < SystemConsts.system.ROW_LIMIT_FOR_LISTS);
            }
        });
      },
      deep: true
    },
  },
  mounted() {
    this.refreshAll();
  },
  components: {
    Edit: () => import('../definition/Edit'),
    List: () => import('./List'),
  },
}
</script>

<style scoped>
  .v-subheader, .v-list-item {
    height: 30px;
    min-height: 30px;
  }
  .altlik-card {
    --wekit-box-shadow: none !important;
    box-shadow: none !important;
    background-color: #EBF3FF;
  }
  .v-menu__content {
    background-color: #EBF3FF;
  }
</style>