<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-account-supervisor</v-icon>
            <div class="d-inline">
              <div>Memberships</div>
              <div class="caption">All the workspaces the user has been joined</div>
            </div>
          </div>

          <div :class="'my-auto text-'+($vuetify.breakpoint.xsOnly ? 'center mt-2' : 'right')">
            <v-btn
              small
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
        <table class="list-table">
          <thead>
            <tr>
              <th>Workspace</th>
              <th width="8%" class="text-center hidden-sm-and-down">Role</th>
              <th width="8%" class="text-center">Status</th>
              <th width="8%" class="text-center hidden-sm-and-down">Retry</th>
              <th width="15%" class="text-center">Date</th>
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

      <block-message 
        v-else dense
        :message="'No membership.'"
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
}
</script>
