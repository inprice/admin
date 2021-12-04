<template>
  <div class="mt-3">
    <v-card tile>
      <v-card-title class="py-2">
        Memberships
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-3">
        <div>In this section, you can manage your workspaces you have been joined.</div>
        <div>
          <strong>Please note</strong>, if you leave from any workspace, you will be able to see the refreshed menu after login again.
        </div>
      </v-card-text>
    </v-card>

    <div class="title mt-5 mb-2">Your memberships</div>

    <v-card v-if="members.length">
      <table class="info-table">
        <thead>
          <tr>
            <th>Workspace</th>
            <th width="15%" class="text-center">Role</th>
            <th width="15%">Date</th>
            <th width="7%" class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in members" :key="row.id">
            <td>{{ row.name }}</td>
            <td class="text-center">{{ row.role }}</td>
            <td><ago :date="row.date"/></td>
            <td class="text-center py-2">
              <v-btn
                small
                v-if="row.role != 'ADMIN'"
                :loading="loading.leave" 
                @click="leave(row.id, row.workspace)"
                :disabled="loading.leave || $store.get('session/isSuperUser')"
              >
                Leave
              </v-btn>
              <span 
                v-else
                class="caption font-weight-medium"
                :style="'color: ' + (CURSTAT.workspace == row.name ? 'blue' : 'green')" 
              >
                Disabled
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <block-message 
      v-else dense
      :message="'You have no membership.'"
    />

    <confirm ref="confirm"></confirm>

  </div>
</template>

<script>
import UserService from '@/service/user';
import { get } from 'vuex-pathify'

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
  computed: {
    CURSTAT: get('session/getCurrentStatus'),
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
    async leave(id, workspace) {
      this.$refs.confirm.open('Leave', 'You are about to leave from ' + workspace + '. Are you sure?').then(async (confirm) => {
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
