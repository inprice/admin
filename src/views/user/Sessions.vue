<template>
  <div class="mt-3">
    <v-card>
      <v-card-title class="pb-2">
        <v-icon class="mr-4">mdi-book-open</v-icon>
        <div>
          <div>Sessions</div>
          <div class="caption">All your opened session.</div>
          <div class="caption">Please note that, if you click Close All button, you will terminate this session as well.</div>
        </div>

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
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table dense v-if="sesList.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th>IP</th>
              <th>System</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ses, index) in sesList" :key="index">
              <td>{{ ses.ip }}</td>
              <td>{{ ses.browser }} on {{ ses.os }}</td>
              <td>
                <ago :date="ses.accessedAt" />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

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