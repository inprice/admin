<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-book-open</v-icon>
            <div class="d-inline">
              <div>Sessions</div>
              <div class="caption">Your opened session.</div>
              <div class="caption">
                <strong>Please note</strong>, if you click Close Sessions button, this session will be terminated too.
              </div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              :loading="loading.closeall" 
              :disabled="loading.closeall"
              @click="closeAllSessions"
            >
              Close sessions
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="sesList.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.ip">IP</th>
                  <th :width="RESPROPS.table.system">System</th>
                  <th :width="RESPROPS.table.date">Date</th>
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
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'You have no active session other than this.'"
      />

    </v-card>
  </div>
</template>

<script>
import UserService from '@/service/user';

export default {
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { ip: '170px', system: '300px', date: '200px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { ip: '15%', system: '', date: '25%' },
          };
        }
      }
    },
  },
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

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>