<template>

  <div>
    <div>
      <div class="title">Links</div>
      <div class="body-2">The list of your competitors linked to your products.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between" v-if="CURSTAT.isActive || CURSTAT.productCount > 0">

      <div class="col-10 pl-0 d-flex">
        <v-text-field 
          autofocus
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
      </div>

      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="100"
        transition="slide-x-transition"
      >

        <template v-slot:activator="{ on, attrs }">
          <v-btn 
            class="col-1 my-auto" 
            v-bind="attrs"
            v-on="on"
          >
            Filters
          </v-btn>
        </template>        

        <v-card class="altlik-card">
          <!-- Statuses -->
          <v-card class="ma-2" tile>
            <v-list dense>  
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class=" font-weight-bold">STATUSES</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-for="(status, index) in statuses" :key="index">
                <v-checkbox 
                  dense
                  v-model="search.statuses"
                  :label="status.text"
                  :value="status.value"
                >
                </v-checkbox>
              </v-list-item>
            </v-list>
          </v-card>

        </v-card>

      </v-menu>

    </div>

    <div class="col pa-0" v-if="CURSTAT.isActive || CURSTAT.productCount > 0">
      <list :rows="searchResult" @deleted="rowDeleted" @statusToggled="statusToggled" />

      <div class="mt-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled">Load More</v-btn>
      </div>
    </div>

    <v-card v-else>
      <block-message 
        class="mt-2"
        :message="'You are not allowed to manage your products until activate your account!'">

        <v-btn 
          :disabled="$store.get('session/isViewer')"
          small
          color="success"
          class="my-auto float-right"
          @click="$router.push( { name: 'plans' })">
            See Plans
        </v-btn>

      </block-message>
    </v-card>

  </div>

</template>

<script>
import LinkService from '@/service/link';
import SystemConsts from '@/data/system';
import { get } from 'vuex-pathify'

export default {
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    statuses() {
      return SystemConsts.STATUSES;
    }
  },
  data() {
    return {
      search: {
        term: '',
        statuses: [],
        counter: 0 //used for trigger search mechanism when update or add a new product (look at edit tag above)
      },
      menu: false,
      searchResult: [],
      isListLoading: true,
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
    };
  },
  methods: {
    clear() {
      this.search.term = '';
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.triggerSearch();
    },
    triggerSearch() {
      ++this.search.counter; //triggers search call to the server
    },
    rowDeleted(index) {
      if (index < this.searchResult.length) {
        this.searchResult.splice(index, 1);
      }
    },
    statusToggled(data) {
      if (data && data.index < this.searchResult.length) {
        this.searchResult[data.index].status = data.status;
      }
    }
  },
  created() {
    this.triggerSearch();
  },
  watch: {
    'search': {
      handler: function (form) {
        //we have to clone it since search form is sensitive for changes.
        //any direct change on search form cause an endless loop for this method!
        const cloneForm = JSON.parse(JSON.stringify(form));
        //clicking load more is a different case
        if (this.isLoadMoreClicked == true && this.searchResult.length) {
          cloneForm.rowCount = this.searchResult.length;
          cloneForm.loadMore = this.isLoadMoreClicked;
        }

        const loadMore = this.isLoadMoreClicked;
        this.isListLoading = true;
        this.isLoadMoreClicked = false;

        LinkService.search(cloneForm, true)
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
      },
      deep: true
    },
  },
  components: {
    List: () => import('./List'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
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
  .v-radio {
    padding: 0 16px;
  }
  .v-input--selection-controls {
    margin-top: 0;
  }
  .v-menu__content {
    background-color: #EBF3FF;
  }
  .v-radio >>> label,
  .v-input--checkbox >>> label {
    font-size: 14px;
    font-weight: 400 !important;
    color: rgba(0, 0, 0, 0.87) !important;
  }
 </style>
