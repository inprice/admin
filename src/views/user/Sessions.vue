<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-book-open</v-icon>
        <div>
          <div>Sessions</div>
          <div class="caption">Other than the session(s) in this browser, all the opened sessions</div>
        </div>

        <v-spacer></v-spacer>

        <v-btn small @click="getOpenedSessions">
          Refresh
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="sessions.length">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th>IP</th>
                <th>System</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ses, index) in sessions" :key="index">
                <td>{{ ses.ip }}</td>
                <td>{{ ses.browser }} on {{ ses.os }}</td>
                <td>
                  <ago :date="ses.accessedAt" />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <v-card-actions class="pt-3">
          <p class="caption mt-4">
            <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
            <b>Please keep in mind</b>: if you click the button, you will terminate this session too.
          </p>
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-3"
            :loading="loading.closeall" 
            :disabled="loading.closeall"
            @click="closeAllSessions"
          >
            Close all sessions
          </v-btn>
        </v-card-actions>
      </div>

      <block-message 
        v-else 
        :message="'You have no active session other than this.'"
      />

    </v-card>
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
      sessions: []
    };
  },
  methods: {
    async getOpenedSessions() {
      const result = await UserService.getOpenedSessions();
      if (result) {
        this.sessions = result;
      } else {
        this.sessions = [];
      }
    },
    async closeAllSessions() {
      this.loading.closeall = true;
      const result = await UserService.closeAllSessions();
      if (result == true) {
        this.$store.dispatch('auth/logout', false);
      }
      this.loading.closeall = false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getOpenedSessions();
    });
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>