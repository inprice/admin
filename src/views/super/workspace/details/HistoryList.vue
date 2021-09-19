<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-history</v-icon>
            <div class="d-inline">
              <div>History</div>
              <div class="caption">Workspace's history list.</div>
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

        <table class="info-table">
          <thead>
            <tr>
              <th width="15%">Date</th>
              <th width="20%">Status</th>
              <th>Plan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>{{ row.createdAt | formatPlainDate }}</td>
              <td>{{ row.status }}</td>
              <td>{{ row.planName }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <block-message 
        v-else dense
        :message="'No history found.'"
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
