<template>
  <div class="mt-3">
    <v-card tile>
      <v-card-title class="py-2">
        Invitations
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-3">
        <div>In this section, you can manage your recieved invitations.</div>
        <div>
          <strong>Please note</strong>, if you accept an invitation, you will be able to see the refreshed menu after login again.
        </div>
      </v-card-text>
    </v-card>

    <div class="title mt-5 mb-2">Your invitations</div>

    <v-card v-if="invitations.length">
      <table class="info-table">
        <thead>
          <tr>
            <th>Workspace</th>
            <th width="15%">Role</th>
            <th width="15%">Date</th>
            <th width="7%" class="text-center">Action</th>
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
                @click="reject(row.id, row.name)"
                :disabled="loading.reject || $store.get('session/isSuperUser') || $store.get('session/isDemoUser')"
              >
                Reject
              </v-btn>
              <v-btn
                small
                class="ml-1"
                color="success"
                :loading="loading.accept" 
                @click="accept(row.id)"
                :disabled="loading.accept || $store.get('session/isSuperUser') || $store.get('session/isDemoUser')"
              >
                Accept
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <block-message 
      v-else dense
      :message="'You have no invitation.'"
    />

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import UserService from '@/service/user';

export default {
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
    async reject(id, workspace) {
      this.$refs.confirm.open('Reject', 'You are about to reject the invitation of ' + workspace + '. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          this.loading.reject = true;
          const result = await UserService.rejectInvitation(id);
          if (result == true) await this.getInvitations();
          this.loading.reject = false;
        }
      });
    }
  },
  mounted() {
    this.getInvitations();
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
    Confirm: () => import('@/component/Confirm.vue')
  }
}
</script>
