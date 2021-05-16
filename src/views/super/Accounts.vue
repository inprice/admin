<template>

  <div>
    <div>
      <div class="title">Accounts</div>
      <div class="body-2">All the registered accounts.</div>
    </div>

    <v-divider class="mt-2"></v-divider>

    <!-- --------------- -->
    <!-- Filter and Rows -->
    <!-- --------------- -->
    <div class="d-flex justify-space-between">
      <div class="col-8 pl-0">
        <v-text-field 
          autofocus
          v-model="searchForm.term"
          @keyup="isSearchable($event)"
          dense solo light
          maxlength="100"
          hide-details
          placeholder="Search by Name"
        >
          <template slot="append">
            <v-icon @click="clear">mdi-window-close</v-icon>
          </template>
        </v-text-field>
      </div>

      <div class="my-auto">
        <v-btn
          small
          text outlined
          @click="unbindAccount"
          :disabled="!CURSTAT.accountId || $store.get('session/isNotSuperUser')"
        >
          Unbind Current
        </v-btn>
      </div>
    </div>

    <div 
      v-if="searchResult && searchResult.length"
      class="v-data-table v-data-table--dense theme--light put-behind"
    >
      <div class="v-data-table__wrapper">

        <table
          class="pb-2"
          :style="{'table-layout': RESPROPS['table-layout']}"
          style="border-collapse: collapse;line-height: 40px;"
        >
          <thead>
            <tr>
              <th :width="RESPROPS.table.name">Name</th>
              <th :width="RESPROPS.table.email">Email</th>
              <th :width="RESPROPS.table.currency">Currency</th>
              <th :width="RESPROPS.table.country">Country</th>
              <th :width="RESPROPS.table.action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in searchResult" :key="acc.xid" :style="(CURSTAT.accountId && CURSTAT.accountId == acc.xid ? 'background-color: lightcyan' : '')">
              <td>{{ acc.name }}</td>
              <td>{{ acc.email }}</td>
              <td>{{ acc.currencyCode }}</td>
              <td>{{ acc.country }}</td>
              <td>
                <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                  <template v-slot:activator="{ on }">
                    <v-btn small icon v-on="on">
                      <v-icon dark>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="bindAccount(acc.xid)">
                      <v-list-item-title>
                        BIND THIS
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <v-card v-else >
      <block-message :message="'No account found! You may want to change your criteria.'" />
    </v-card>

    <v-divider></v-divider>

    <div class="mt-3">
      <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
    </div>
  </div>

</template>

<script>
import SuperService from '@/service/super';
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
      searchResult: [],
      isLoadMoreDisabled: true,
      isLoadMoreClicked: false,
    };
  },
  methods: {
    clear() {
      this.searchForm.term = '';
    },
    loadmore() {
      this.isLoadMoreClicked = true;
      this.search();
    },
    search() {
      if (this.isLoadMoreClicked == true && this.searchResult.length) {
        this.searchForm.rowCount = this.searchResult.length;
        this.searchForm.loadMore = this.isLoadMoreClicked;
      } else {
        this.searchForm.rowCount = 0;
      }

      const loadMore = this.isLoadMoreClicked;
      this.isLoadMoreClicked = false;

      SuperService.searchAccount(this.searchForm)
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
    async bindAccount(id) {
      const res = await SuperService.bindAccount(id);
      if (res && res.data) {
        this.$store.commit('session/SET_CURRENT', res.data, 0);
      }
    },
    unbindAccount() {
      this.$store.dispatch('session/unbindAccount');
    },
    isSearchable(e) {
      let char = e.keyCode || e.charCode;
      if (char == 8 || char == 46 || (char > 64 && char < 91) || (char > 96 && char < 123)) {
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
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { name: '250px', email: '250px', currency: '80px', country: '120px', action: '70px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { name: '', email: '', currency: '8%', country: '15%', action: '8%' },
          };
        }
      }
    },
  },
}
</script>
