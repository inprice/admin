<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-account-supervisor</v-icon>
        <div>
          <div>Memberships</div>
          <div class="caption">All the accounts you have been joined</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn small @click="refreshMembers">
          Refresh
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="members.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>Account</th>
                <th width="5%" class="text-center">Role</th>
                <th width="20%" class="text-center">Date</th>
                <th width="12%" class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mem in members" :key="mem.id">
                <td>{{ mem.name }}</td>
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
                    @click="leave(mem.id, mem.account)"
                  >
                    Leave
                  </v-btn>
                  <div v-else>YOURS</div>
                </td>
                <td class="text-center" v-else>{{ mem.status }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <p class="caption py-4">
          <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
          Please note: If you leave from any account, you will be able to see the refreshed menu after login again.
        </p>

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
  created() {
    this.$nextTick(() => {
      this.refreshMembers();
    });
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
