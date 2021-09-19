<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div :class="($vuetify.breakpoint.xsOnly ? 'mb-2' : 'd-flex justify-space-between')">
          <div class="d-flex">
            <v-icon class="mr-4 hidden-xs-only">mdi-book-open</v-icon>
            <div class="d-inline">
              <div>Transactions</div>
              <div class="caption">Workspace's transaction list.</div>
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
              <th width="20%">Event</th>
              <th>Description or File</th>
              <th width="7%" class="text-center">OK</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>{{ row.createdAt | formatPlainDate }}</td>
              <td>{{ row.event }} - {{ row.eventId }}</td>
              <td v-if="row.fileUrl"><a :href="row.fileUrl">row.fileUrl</a></td>
              <td v-else>{{ row.reason || row.description }}</td>
              <td class="text-center">{{ row.successful ? 'YES' : 'NO' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <block-message 
        v-else dense
        :message="'Workspace has no transaction yet.'"
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
