<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-workspace-supervisor</v-icon>
            <div class="d-inline">
              <div>Memberships</div>
              <div class="caption">All the workspaces the user has been joined</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
              color="white"
              class="my-auto"
              @click="$emit('refreshed')"
              :disabled="$store.get('session/isNotSuperUser')"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <div v-if="list.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}">
              <thead>
                <tr>
                  <th :width="RESPROPS.table.workspace">Workspace</th>
                  <th class="text-center" :width="RESPROPS.table.role">Role</th>
                  <th class="text-center" :width="RESPROPS.table.status">Status</th>
                  <th class="text-center" :width="RESPROPS.table.retry">Retry</th>
                  <th class="text-center" :width="RESPROPS.table.date">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td>{{ row.workspaceName }}</td>
                  <td class="text-center">{{ row.role }}</td>
                  <td class="text-center">{{ row.status }}</td>
                  <td class="text-center">{{ row.retry }}</td>
                  <td class="text-center">{{ row.createdAt | formatPlainDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'User has no membership.'"
      />

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['list'],
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { workspace: '250px', role: '100px', status: '100px', retry: '70px', date: '200px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { workspace: '', role: '12%', status: '12%', retry: '8%', date: '20%' },
          };
        }
      }
    },
  },
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>
