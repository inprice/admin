<template>

  <div>
    <div>
      <div class="title">Users</div>
      <div class="body-2">All the registered users.</div>
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
    </div>

    <v-card>
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
                <th :width="RESPROPS.table.email">Email</th>
                <th :width="RESPROPS.table.bannedAt">Banned</th>
                <th :width="RESPROPS.table.reason">Reason</th>
                <th :width="RESPROPS.table.action">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in searchResult" :key="row.id">
                <td>{{ row.email }}</td>
                <td><ago :date="row.bannedAt" /></td>
                <td>{{ row.banReason }}</td>
                <td style="padding: 0px !important; text-align: center !important;">
                  <v-menu offset-y bottom left :disabled="$store.get('session/isNotSuperUser')">
                    <template v-slot:activator="{ on }">
                      <v-btn small icon v-on="on">
                        <v-icon dark>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item link :to="{ name: 'sys-user-details', params: { uid: row.id } }">
                        <v-list-item-title>DETAILS</v-list-item-title>
                      </v-list-item>
                      <v-list-item link :to="{ name: 'sys-user-logs', params: { uid: row.id }, query: { email: row.email } }">
                        <v-list-item-title>ACCESS LOGS</v-list-item-title>
                      </v-list-item>

                      <v-divider></v-divider>

                      <v-list-item @click="banUser(row.id, row.email)" v-if="!row.bannedAt">
                        <v-list-item-title>BAN THIS USER</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="revokeUserBan(row.id, row.email)" v-else>
                        <v-list-item-title>REVOKE USER BAN</v-list-item-title>
                      </v-list-item>

                      <v-divider></v-divider>

                      <v-list-item @click="makeAnAnnouncement(row.id, row.email)">
                        <v-list-item-title>MAKE AN ANNOUNCEMENT</v-list-item-title>
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
        <block-message :message="'No user found! You may want to change your criteria.'" />
      </v-card>

      <v-divider></v-divider>

      <div class="pl-3 py-3">
        <v-btn @click="loadmore" :disabled="isLoadMoreDisabled" v-if="searchResult.length > 0">Load More</v-btn>
      </div>

    </v-card>

    <ban-dialog subject="User" ref="banDialog" @banned="banned" />

    <announce-dialog ref="announceDialog" @saved="saveAnnounce" />

    <confirm ref="confirm"></confirm>

  </div>

</template>

<script>
import SU_UserService from '@/service/super/user';
import SU_AnnounceService from '@/service/super/announce';
import SystemConsts from '@/data/system';

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

      SU_UserService.search(this.searchForm)
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
    banUser(id, name) {
      this.$refs.banDialog.open({ id, name });
    },
    banned(form) {
      SU_UserService.ban(form)
        .then((res) => {
          if (res && res.status) {
            this.$store.commit('snackbar/setMessage', { text: `${form.name} is successfully banned.` });
            this.user.bannedAt = 'JUST NOW';
            this.user.banReason = form.reason;
            this.user.banned = true;
          }
        });
    },
    revokeUserBan(id, email) {
      this.$refs.confirm.open('Revoke Ban', '\'s ban will be revoked. Are you sure?', email).then((confirm) => {
        if (confirm == true) {
          SU_UserService.revokeBan(id)
            .then((res) => {
              if (res && res.status) {
                this.$store.commit('snackbar/setMessage', { text: `${email}'s ban is successfully revoked` });
                this.search();
              }
            });
        }
      });
    },
    makeAnAnnouncement(id, email) {
      const form = {
        userId: id,
        forWhom: email
      };
      this.$refs.announceDialog.open(form);
    },
    async saveAnnounce(form) {
      const result = await SU_AnnounceService.save(form);
      if (result && result.status) {
        this.$store.commit('snackbar/setMessage', { text: 'Account\'s announce is successfully published.' });
      }
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
    BanDialog: () => import('./BanDialog.vue'),
    AnnounceDialog: () => import('../announce/Edit.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { email: '250px', reason: '', bannedAt: '150px', action: '70px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { email: '12%', reason: '', bannedAt: '15%', action: '8%' },
          };
        }
      }
    },
  },
}
</script>
