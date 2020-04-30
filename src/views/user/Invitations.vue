<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-plus-outline</v-icon>
        <div>
          <div>Invitations</div>
          <div class="caption">You manage your recieved invitations here to join other companies</div>
        </div>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              small icon
              v-on="on"
              elevation="1"
              :loading="loading.refresh" 
              :disabled="loading.refresh"
              @click="getInvitations"
            >
              <v-icon>mdi-refresh-circle</v-icon>
            </v-btn>
          </template>
          <span>Refresh the list</span>
        </v-tooltip>
      </v-card-title>

      <div v-if="invitations.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Company</th>
                <th width="5%" class="text-center">Role</th>
                <th width="20%" class="text-center">Date</th>
                <th width="24%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in invitations" :key="inv.id">
                <td>{{ inv.company }}</td>
                <td class="text-center">{{ inv.role }}</td>
                <td class="text-center">{{ inv.date }}</td>
                <td class="text-right">
                  <v-btn
                    small
                    class="mx-2"
                    :loading="loading.reject" 
                    :disabled="loading.reject"
                    @click="reject(inv.id, inv.company)"
                  >
                    Reject
                  </v-btn>
                  <v-btn
                    small
                    class="mx-2"
                    color="success"
                    :loading="loading.accept" 
                    :disabled="loading.accept"
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

        <p class="caption py-4">
          <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
          Please note: You will be able to see all accepted companies after login again.
        </p>

      </div>
      <div v-else>
        <v-divider></v-divider>
        <v-card-text>
          <p>
            You have no invitation right now.
          </p>
        </v-card-text>
      </div>

    </v-card>

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import UserService from '@/service/user';
import Utility from '@/helpers/utility';

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
    async reject(id, company) {
      this.$refs.confirm.open('Reject', 'You are about to reject the invitation of ' + company + '. Are you sure?').then(async (confirm) => {
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
    Utility.doubleRaf(() => {
      this.getInvitations();
    });
  },
  components: {
    confirm: () => import('@/component/Confirm.vue')
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>