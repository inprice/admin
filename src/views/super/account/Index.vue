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
      <div class="col-6 pl-0">
        <v-text-field 
          :loading="loading"
          dense solo light
          hide-details
          maxlength="100"
          placeholder="Search..."
          v-model="searchForm.term"
          @keyup="isSearchable($event)"
        >
          <template slot="append">
            <v-icon @click="clear">mdi-window-close</v-icon>
          </template>
        </v-text-field>
      </div>

      <v-btn
        color="white"
        class="my-auto"
        @click="unbindAccount"
        :disabled="!CURSTAT.accountId || $store.get('session/isNotSuperUser')"
      >
        Unbind Current
      </v-btn>
    </div>

    <v-card v-if="searchResult && searchResult.length">
      <table class="pb-2 list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th width="20%">Plan</th>
            <th width="15%">Status</th>
            <th width="15%">Updated</th>
            <th width="5%">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in searchResult" :key="row.id" :style="(CURSTAT.accountId && CURSTAT.accountId == row.id ? 'background-color: lightcyan' : '')">
            <td style="padding: 3px 10px">
              {{ row.name }}
              <div class="caption font-weight-light">{{ row.email }}</div>
            </td>
            <td>{{ row.plan }}</td>
            <td>{{ row.status }}</td>
            <td>{{ row.lastStatusUpdated }}</td>
            <td style="padding: 0px !important; text-align: center !important;">
              <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                <template v-slot:activator="{ on }">
                  <v-btn small icon v-on="on">
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item @click="unbindAccount(row.id)" v-if="CURSTAT.accountId && CURSTAT.accountId == row.id">
                    <v-list-item-title>
                      UNBIND THIS
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="bindAccount(row.id)" v-else>
                    <v-list-item-title>
                      BIND THIS
                    </v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item link :to="{ name: 'sys-account-details', params: { aid: row.id } }">
                    <v-list-item-title>DETAILS</v-list-item-title>
                  </v-list-item>
                  <v-list-item link :to="{ name: 'sys-account-logs', params: { aid: row.id }, query: { name: row.name } }">
                    <v-list-item-title>ACCESS LOGS</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="openCreateCouponDialog(row.id, row.name)">
                    <v-list-item-title>CREATE COUPON</v-list-item-title>
                  </v-list-item>

                  <v-divider></v-divider>

                  <v-list-item @click="makeAnAnnouncement(row.id, row.name)">
                    <v-list-item-title>MAKE AN ANNOUNCEMENT</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>

      <v-divider></v-divider>

      <div class="pl-3 py-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">More</v-btn>
      </div>
      
    </v-card>

    <v-card v-else >
      <block-message :message="'No account found! You may want to change your criteria.'" />
    </v-card>

    <create-coupon ref="createCouponDialog" />

    <announce-dialog ref="announceDialog" @saved="saveAnnounce" />

  </div>

</template>

<script>
import SU_AccountService from '@/service/super/account';
import SU_AnnounceService from '@/service/super/announce';
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
  methods: {
    clear() {
      this.searchForm.term = '';
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

      SU_AccountService.search(this.searchForm)
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
    async bindAccount(id) {
      const res = await SU_AccountService.bind(id);
      if (res && res.data) {
        this.$store.commit('session/SET_CURRENT', res.data, 0);
      }
    },
    unbindAccount() {
      this.$store.dispatch('session/unbindAccount');
    },
    openCreateCouponDialog(id, name) {
      this.$refs.createCouponDialog.open({ id, name });
    },
    makeAnAnnouncement(id, name) {
      const form = {
        accountId: id,
        forWhom: name
      };
      this.$refs.announceDialog.open(form);
    },
    async saveAnnounce(form) {
      const result = await SU_AnnounceService.save(form);
      if (result && result.status) {
        this.$store.commit('snackbar/setMessage', { text: 'User\'s announce is successfully published.' });
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
    AnnounceDialog: () => import('../announce/Edit.vue'),
    CreateCoupon: () => import('./CreateCoupon.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
}
</script>
