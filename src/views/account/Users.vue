<template>
  <div class="mt-5">

    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-multiple</v-icon>
        <div>
          <div>Users</div>
          <div class="caption">Your users are listed in this section</div>
        </div>

        <v-spacer></v-spacer>

        <div>
          <v-btn small class="mx-2" @click="refreshMembers">
            Refresh
          </v-btn>

          <v-btn small dark color="success" class="mx-2" @click="openSendDialog">
            Invite a user
          </v-btn>
        </div>

      </v-card-title>

      <div v-if="members.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Email</th>
                <th width="10%" class="text-center">Role</th>
                <th width="10%" class="text-center">Status</th>
                <th width="3%" class="text-center d-none d-sm-table-cell">Retry</th>
                <th width="20%" class="text-center hidden-sm-and-down">Date</th>
                <th width="5%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mem in members" :key="mem.id">
                <td>{{ mem.email }}</td>
                <td class="text-center">{{ mem.role }}</td>
                <td class="text-center">{{ mem.status }}</td>
                <td class="text-center d-none d-sm-table-cell">{{ mem.retry }}/3</td>
                <td class="text-center hidden-sm-and-down">
                  <ago :date="mem.updatedAt || mem.createdAt" />
                </td>
                <td class="text-right" v-if="mem.status != 'LEFT' && mem.status != 'DELETED'">
                  <v-menu offset-y left>
                    <template v-slot:activator="{ on }">
                      <v-btn x-small fab elevation="1"  v-on="on">
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
                <td class="text-center" v-else>
                  {{ mem.status }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <div class="caption py-4 flex pl-4">
          Please note that
          <ul>
            <li>You are allowed to add users up to user limit of your plan</li>
            <li>Deleted users will be permanently deleted within three hours.</li>
          </ul>
        </div>

      </div>

      <block-message 
        v-else 
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
  mounted() {
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
  .v-data-table th {
    height: 30px;
  }
  .v-data-table__wrapper thead tr {
    background: #DDDD;
  }
  .v-icon.v-icon::after {
    height: 0;
  }
</style>
