<template>
  <div class="mt-3">
    <v-card tile>
      <v-card-title class="py-2">
        Sessions
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-3">
        <div>Your opened sessions.</div>
        <div>
          <b>Please note</b>, if you click <b class="teal--text">Close All</b> button, all your sessions including this will be terminated.
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-btn
          small
          :loading="loading.closeall" 
          @click="closeAllSessions"
          :disabled="loading.closeall || $store.get('session/isSuperUser') || $store.get('session/isDemoUser')"
        >
          Close All
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="title mt-5 mb-2">Active sessions</div>

    <v-card v-if="sesList.length">
      <table class="info-table">
        <thead>
          <tr>
            <th width="15%">IP</th>
            <th>System</th>
            <th width="15%">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in sesList" :key="index">
            <td>{{ row.ip }}</td>
            <td>{{ row.browser }} on {{ row.os }}</td>
            <td><ago :date="row.accessedAt" /></td>
          </tr>
        </tbody>
      </table>
    </v-card>

    <block-message 
      v-else dense
      :message="'You have no active session.'"
    />

  </div>
</template>

<script>
import UserService from '@/service/user';

export default {
  data() {
    return {
      loading: {
        refresh: false,
        closeall: false
      },
      sesList: []
    };
  },
  methods: {
    async getOpenedSessions() {
      const result = await UserService.getOpenedSessions();
      if (result) {
        this.sesList = result;
      } else {
        this.sesList = [];
      }
    },
    async closeAllSessions() {
      this.loading.closeall = true;
      const result = await UserService.closeAllSessions();
      if (result == true) {
        this.$store.dispatch('session/logout', false);
      }
      this.loading.closeall = false;
    }
  },
  mounted() {
    this.getOpenedSessions();
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>
