<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-plus-outline</v-icon>
            <div class="d-inline">
              <div>Invitations</div>
              <div class="caption">Your recieved invitations</div>
              <div class="caption">
                <strong>Please note</strong>, if you accept an invitation, you will be able to see the refreshed menu after login again.
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn small class="my-auto" @click="getInvitations">
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="invitations.length">
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
                <tr v-for="row in invitations" :key="row.id">
                  <td>{{ row.name }}</td>
                  <td>{{ row.role }}</td>
                  <td><ago :date="row.date"/></td>
                  <td class="text-right py-2">
                    <v-btn
                      small
                      class="mr-1"
                      :loading="loading.reject" 
                      :disabled="loading.reject"
                      @click="reject(row.id, row.name)"
                    >
                      Reject
                    </v-btn>
                    <v-btn
                      small
                      class="ml-1"
                      color="success"
                      :loading="loading.accept" 
                      :disabled="loading.accept"
                      @click="accept(row.id)"
                    >
                      Accept
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'You have no invitation right now.'"
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
            table: { account: '', role: '12%', date: '15%', action: '25%' },
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
        reject: false,
      },
      invitations: []
    };
  },
  methods: {
    async getInvitations() {
      this.loading.refresh = true;
      const result = await UserService.getInvitations();
      if (result) {
        this.invitations = result;
      } else {
        this.invitations = [];
      }
      this.loading.refresh = false;
    },
    async accept(id) {
      this.loading.accept = true;
      const result = await UserService.acceptInvitation(id);
      if (result == true) {
        await this.getInvitations();
        this.$emit('accept');
      }
      this.loading.accept = false;
    },
    async reject(id, account) {
      this.$refs.confirm.open('Reject', 'You are about to reject the invitation of ' + account + '. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          this.loading.reject = true;
          const result = await UserService.rejectInvitation(id);
          if (result == true) await this.getInvitations();
          this.loading.reject = false;
        }
      });
    }
  },
  created() {
    this.$nextTick(() => {
      this.getInvitations();
    });
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>