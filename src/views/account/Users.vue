<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-multiple</v-icon>
            <div class="d-inline">
              <div>Users</div>
              <div class="caption">Your users are listed in this section</div>
              <div class="caption">
                <strong>Please note,</strong> users will not be immediately deleted. For a permanent delete, three hours time should be passed.
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn small color="success" class="mr-1" @click="openSendDialog">
              Invite
            </v-btn>

            <v-btn small class="ml-1" @click="refreshMembers">
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
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.email">Email</th>
                  <th :width="RESPROPS.table.role">Role</th>
                  <th :width="RESPROPS.table.status">Status</th>
                  <th :width="RESPROPS.table.retry">Retry</th>
                  <th :width="RESPROPS.table.date">Date</th>
                  <th :width="RESPROPS.table.action">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mem in members" :key="mem.id">
                  <td>{{ mem.email }}</td>
                  <td>{{ mem.role }}</td>
                  <td>{{ mem.status }}</td>
                  <td>{{ mem.retry }}/3</td>
                  <td>
                    <ago :date="mem.updatedAt || mem.createdAt" />
                  </td>
                  <td v-if="mem.status != 'LEFT' && mem.status != 'DELETED'">
                    <v-menu>
                      <template v-slot:activator="{ on }">
                        <v-btn x-small fab elevation="1"  v-on="on" class="my-1">
                          <v-icon dark>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>

                      <v-list dense>
                        <v-list-item @click="changeRole(mem.id, mem.role, 'EDITOR')">
                          <v-list-item-title>
                            EDITOR
                            <v-icon right v-if="mem.role == 'EDITOR'">mdi-check</v-icon>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="changeRole(mem.id, mem.role, 'VIEWER')">
                          <v-list-item-title>
                            VIEWER
                            <v-icon right v-if="mem.role == 'VIEWER'">mdi-check</v-icon>
                          </v-list-item-title>
                        </v-list-item>

                        <v-divider></v-divider>

                        <v-list-item @click="pause(mem.id)" v-if="mem.status == 'PENDING' || mem.status == 'JOINED'">
                          <v-list-item-title>PAUSE</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="resume(mem.id)" v-if="mem.status == 'PAUSED'">
                          <v-list-item-title>RESUME</v-list-item-title>
                        </v-list-item>

                        <v-divider></v-divider>

                        <v-list-item @click="remove(mem.id, mem.email)" v-if="mem.status != 'LEFT' && mem.retry < 3">
                          <v-list-item-title>DELETE</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="resend(mem.id)" v-if="mem.status == 'PENDING' && mem.retry < 3">
                          <v-list-item-title>INVITE AGAIN</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                  </td>
                  <td v-else>
                    {{ mem.status }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <block-message 
        v-else dense
        :message="'You have no user right now.'"
      />

    </v-card>

    <SendInvitation ref="sendDialog" @send="send"/>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import MemberService from '@/service/member';

export default {
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { email: '250px', role: '120px', status: '120px', retry: '70px', date: '150px', action: '70px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { email: '', role: '12%', status: '12%', retry: '8%', date: '20%', action: '8%' },
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
    openSendDialog() {
      this.$refs.sendDialog.open();
    },
    async send(form) {
      const result = await MemberService.send(form);
      if (result == true) {
        this.$refs.sendDialog.close();
        this.refreshMembers();
      } else {
        this.$refs.sendDialog.stopLoading();
      }
    },
    async resend(id) {
      const result = await MemberService.resend(id);
      if (result == true) {
        this.$store.commit('snackbar/setMessage', { text: 'A new invitation mail is successfully sent to the member' });
        this.refreshMembers();
      }
    },
    async changeRole(id, oldRole, newRole) {
      if (oldRole == newRole) return;
      const result = await MemberService.changeRole({ id, role: newRole });
      if (result == true) this.refreshMembers();
    },
    async pause(id) {
      const result = await MemberService.pause(id);
      if (result == true) this.refreshMembers();
    },
    async resume(id) {
      const result = await MemberService.resume(id);
      if (result == true) this.refreshMembers();
    },
    remove(id, name) {
      this.$refs.confirm.open('Delete', 'will be deleted. Are you sure?', name).then(async (confirm) => {
        if (confirm == true) {
          const result = await MemberService.remove(id);
          if (result == true) {
            this.$store.commit('snackbar/setMessage', { text: 'User successfully deleted. List will be updated after three hours.' });
            this.refreshMembers();
          }
        }
      });
    },
    async refreshMembers() {
      const result = await MemberService.list();
      if (result) {
        this.members = result;
      } else {
        this.members = [];
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.refreshMembers();
    });
  },
  components: {
    SendInvitation: () => import('./components/SendInvitation.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  }
}
</script>

<style scoped>
  .v-icon.v-icon::after {
    height: 0;
  }
</style>
