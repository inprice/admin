<template>
  <div>
    <v-card class="mt-3">
      <v-card-title class="py-2">
        Team members
      </v-card-title>
      
      <v-divider></v-divider>

      <v-card-text class="py-3">
        <div class="font-weight-bold">Please keep in mind;</div>
        <ul class="py-2">
          <li>In order to invite new members, you must have ADMIN role and subscribe to Starter or a higher plan.</li>
          <li>Members are not deleted immediately. This operation is completed within three hours.</li>
        </ul>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn
          small
          @click="openSendDialog"
          :disabled="$store.get('session/isNotAdmin') || !CURSTAT.planId || CURSTAT.planId == 1"
        >
          Invite
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="mt-5 mb-2 title">Invited members</div>

    <v-card v-if="members.length">
      <table class="list-table">
        <thead>
          <tr>
            <th>Email</th>
            <th width="15%">Role</th>
            <th width="15%">Status</th>
            <th width="5%">Retry</th>
            <th width="15%">Date</th>
            <th width="3%"></th>
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
            <td v-if="$store.get('session/isAdmin') && mem.status != 'LEFT' && mem.status != 'DELETED'">
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on="on"
                    class="my-1"
                  >
                    <v-icon dark>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item @click="changeRole(mem.id, mem.role, 'EDITOR')">
                    <v-list-item-title>
                      EDITOR
                    </v-list-item-title>
                    <v-icon v-if="mem.role == 'EDITOR'">mdi-check</v-icon>
                  </v-list-item>
                  <v-list-item @click="changeRole(mem.id, mem.role, 'VIEWER')">
                    <v-list-item-title>
                      VIEWER
                    </v-list-item-title>
                    <v-icon v-if="mem.role == 'VIEWER'">mdi-check</v-icon>
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
    </v-card>

    <block-message 
      v-else dense
      message="No member found."
    ></block-message>

    <confirm ref="confirm"></confirm>
    <send-invitation ref="invitationDialog" @send="send"></send-invitation>

  </div>
</template>

<script>
import MemberService from '@/service/member';
import { get } from 'vuex-pathify'

export default {
  data() {
    return {
      loading: {
        accept: false,
        leave: false,
      },
      members: []
    };
  },
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
  },
  methods: {
    openSendDialog() {
      this.$refs.invitationDialog.open();
    },
    async send(form) {
      const result = await MemberService.send(form);
      if (result == true) {
        this.$refs.invitationDialog.close();
        this.refreshMembers();
      } else {
        this.$refs.invitationDialog.stopLoading();
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
    this.refreshMembers();
  },
  components: {
    SendInvitation: () => import('./SendInvitation.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  }
}
</script>
