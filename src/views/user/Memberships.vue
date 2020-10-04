<template>
  <div class="mt-5">
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-account-supervisor</v-icon>
        <div>
          <div>Memberships</div>
          <div class="caption">All the companies you have been joined are listed in this section.</div>
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
              @click="refreshMemberships"
            >
              <v-icon>mdi-refresh-circle</v-icon>
            </v-btn>
          </template>
          <span>Refresh the list</span>
        </v-tooltip>
      </v-card-title>

      <div v-if="memberships.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Company</th>
                <th width="5%" class="text-center">Role</th>
                <th width="20%" class="text-center">Date</th>
                <th width="12%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mem in memberships" :key="mem.id">
                <td>{{ mem.company }}</td>
                <td class="text-center">{{ mem.role }}</td>
                <td class="text-center">
                  <ago :date="mem.date" />
                </td>
                <td class="text-center" v-if="mem.status == 'JOINED'">
                  <v-btn
                    v-if="mem.role != 'ADMIN'"
                    small
                    :loading="loading.leave" 
                    :disabled="loading.leave"
                    @click="leave(mem.id, mem.company)"
                  >
                    Leave
                  </v-btn>
                  <div v-else>YOURS</div>
                </td>
                <td class="text-center" v-else>LEFT</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <p class="caption py-4">
          <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
          Please note: If you leave from any company, you will be able to see refreshed user menu after login again.
        </p>

      </div>
      <div v-else>
        <v-divider></v-divider>
        <v-card-text>
          <p>
            You have no membership right now.
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
        leave: false,
      },
      memberships: []
    };
  },
  methods: {
    async refreshMemberships() {
      this.loading.refresh = true;
      const result = await UserService.getMemberships();
      if (result) {
        this.memberships = result;
      } else {
        this.memberships = [];
      }
      this.loading.refresh = false;
    },
    async leave(id, company) {
      this.$refs.confirm.open('Leave', 'You are about to leave from ' + company + '. Are you sure?').then(async (confirm) => {
        if (confirm == true) {
          this.loading.leave = true;
          const result = await UserService.leaveMembership(id);
          if (result == true) await this.refreshMemberships();
          this.loading.leave = false;
        }
      });
    }
  },
  mounted() {
    Utility.doubleRaf(() => {
      this.refreshMemberships();
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
