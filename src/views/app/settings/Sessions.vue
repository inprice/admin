<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-4">mdi-book-open</v-icon>
        Other Active Sessions

        <v-spacer></v-spacer>

        <v-btn
          small
          icon
          :loading="loading" 
          :disabled="loading"
          @click="getOpenedSessions"
        >
          <v-icon>mdi-refresh-circle</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <div v-if="sessions.length">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>IP</th>
                <th>System</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ses in sessions" :key="ses.date">
                <td>{{ ses.ip }}</td>
                <td>{{ ses.browser }} on {{ ses.os }}</td>
                <td>{{ ses.date }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-divider></v-divider>

        <v-card-actions class="pt-3">
          <p class="caption mt-4 font-italic">
            <v-icon class="mx-2">mdi-alert-circle-outline</v-icon>
            Please keep in mind: if you click the button, you will terminate this session too.
          </p>
          <v-spacer></v-spacer>
          <v-btn
            small
            class="mr-3"
            :loading="loading" 
            :disabled="loading"
            @click="closeAllSessions"
          >
            Close all sessions
          </v-btn>
        </v-card-actions>
      </div>
      <v-card-text v-else>
        <p>
          You have no session other than this.
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
      this.loading = true;
      const result = await UserService.closeAllSessions();
      if (result == true) {
        this.$store.dispatch('session/logout', false);
        return;
      }
      this.loading = false;
    }
  },

  mounted() {
    Utility.doubleRaf(() => {
      this.getOpenedSessions();
    });
  }

}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>