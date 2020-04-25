<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-plus-outline</v-icon>
        Invitations

        <v-spacer></v-spacer>

        <v-btn
          small
          icon
          :loading="loading" 
          :disabled="loading"
          @click="getInvitations"
        >
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-card-title>

      <div v-if="invitations.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Invitor Company</th>
                <th width="5%" class="text-center">Role</th>
                <th width="20%" class="text-center">Date</th>
                <th width="20%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invitations" :key="inv.id">
                <td class="red--text font-weight-bold">{{ inv.company }}</td>
                <td class="blue--text font-weight-bold text-center">{{ inv.role }}</td>
                <td class="text-center">{{ inv.date }}</td>
                <td class="text-center">
                  <v-btn
                    small
                    class="mr-3"
                    :loading="loading" 
                    :disabled="loading"
                    @click="reject(inv.id)"
                  >
                    Reject
                  </v-btn>
                  <v-btn
                    small
                    color="success"
                    :loading="loading" 
                    :disabled="loading"
                    @click="accept(inv.id)"
                  >
                    Accept
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <p class="caption py-4 font-italic">
          <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
          Please note: if you accept an invitation, you will be redirected to login page to sign in again.
        </p>

      </div>
      <v-card-text v-else>
        <p>
          You have no invitation right now.
        </p>
      </v-card-text>

    </v-card>
  </div>
</template>

<script>
import UserService from '@/service/user';
import Utility from '@/helpers/utility';

export default {
  data() {
    return {
      loading: false,
      invitations: []
    };
  },
  methods: {
    async getInvitations() {
      const result = await UserService.getInvitations();
      if (result) {
        this.invitations = result;
      } else {
        this.invitations = [];
      }
    },
    async accept(id) {
      this.loading = true;
      const result = await UserService.acceptInvitation(id);
      if (result == true) {
        this.$store.dispatch('session/logout', false);
        return;
      }
      this.loading = false;
    },
    async reject(id) {
      this.loading = true;
      const result = await UserService.rejectInvitation(id);
      if (result == true) this.getInvitations();
      this.loading = false;
    }
  },

  mounted() {
    Utility.doubleRaf(() => {
      this.getInvitations();
    });
  }

}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>