<template>
  <v-card>
    <table class="pb-2 list-table">
      <thead>
        <tr>
          <th width="20%">Date</th>
          <th>Path</th>
          <th width="8%">Method</th>
          <th width="8%" class="text-right">Status</th>
          <th width="8%" class="text-right hidden-xs-only">Elapsed</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="row in rows" :key="row.id"
          @click="openLogDetailsDialog(row)"
        >
          <td>{{ row.createdAt }}</td>
          <td>{{ row.path }} {{ row.pathExt }}</td>
          <td>{{ row.method }}</td>
          <td class="text-right">{{ row.status }}</td>
          <td class="text-right hidden-xs-only">{{ row.elapsed }}</td>
        </tr>
      </tbody>
    </table>

    <log-details-dialog ref="logDetailsDialog" />

  </v-card>
</template>

<script>
export default {
  props: ['rows', 'selectedId'],
  methods: {
    openLogDetailsDialog(row) {
      this.$refs.logDetailsDialog.open(row);
    },
  },
  components: {
    LogDetailsDialog: () => import('./AccessLogDetails.vue')
  }
};
</script>
