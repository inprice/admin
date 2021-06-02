<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-supervisor</v-icon>
            <div class="d-inline">
              <div>Memberships</div>
              <div class="caption">All the accounts you have been joined</div>
              <div class="caption">
                <strong>Please note</strong>, if you leave from any account, you will be able to see the refreshed menu after login again.
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              color="white"
              class="my-auto"
              @click="refreshMembers"
              :disabled="$store.get('session/isSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="members.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.account">Account</th>
                  <th :width="RESPROPS.table.role">Role</th>
                  <th :width="RESPROPS.table.date">Date</th>
                  <th :width="RESPROPS.table.action" class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in members" :key="row.id">
                  <td>{{ row.name }}</td>
                  <td>{{ row.role }}</td>
                  <td><ago :date="row.date"/></td>
                  <td class="text-center py-2">
                    <v-btn
                      small
                      v-if="row.role != 'ADMIN'"
                      :loading="loading.leave" 
                      @click="leave(row.id, row.account)"
                      :disabled="loading.leave || $store.get('session/isSuperUser')"
                    >
                      Leave
                    </v-btn>
                    <v-chip outlined label color="success" small v-else>YOURS</v-chip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'You have no member right now.'"
      />

    </v-card>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import UserService from '@/service/user';

export default {
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { account: '250px', role: '120px', date: '200px', action: '210px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { account: '', role: '12%', date: '15%', action: '12%' },
          };
        }
      }
    },
  },
  data() {
    return {
      loading: {
        refresh: false,
        accept: false,
        leave: false,
      },
      members: []
    };
  },
  methods: {
    async refreshMembers() {
      this.loading.refresh = true;
      const result = await UserService.getMemberships();
      if (result) {
        this.members = result;
      } else {
        this.members = [];
      }
      this.loading.refresh = false;
    },
    async leave(id, account) {
      this.$refs.confirm.open('Leave', 'You are about to leave from ' + account + '. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          this.loading.leave = true;
          const result = await UserService.leaveMember(id);
          if (result == true) await this.refreshMembers();
          this.loading.leave = false;
        }
      });
    }
  },
  mounted() {
    this.refreshMembers();
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue'),
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>
