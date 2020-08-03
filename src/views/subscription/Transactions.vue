<template>
  <v-card class="mt-5">
    <v-card-title class="pb-0">
      <v-icon class="mr-4">mdi-clipboard-list-outline</v-icon>
      <div>
        <div>Transactions</div>
      </div>
    </v-card-title>

    <v-tabs v-if="(all && all.length) || (invoices && invoices.length)">
      <v-tab>All</v-tab>
      <v-tab>Invoices</v-tab>

      <v-tab-item v-if="all && all.length">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="15%">Date</th>
                <th width="10%">Event</th>
                <th>Reason</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in all" :key="row.id">
                <td>{{ row.createdAt | formatDate }}</td>
                <td>{{ row.event }}</td>
                <td>{{ row.reason }}</td>
                <td>{{ row.description }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

      <v-tab-item v-if="invoices && invoices.length">
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="15%">Date</th>
                <th width="10%">Event</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in invoices" :key="row.id">
                <td>{{ row.createdAt | formatDate }}</td>
                <td>{{ row.event }}</td>
                <td><v-btn :href="row.fileUrl" target="_blank" small class="ma-1">Open a new tab <v-icon right>mdi-arrow-right-circle-outline</v-icon></v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

    </v-tabs>

    <div v-else class="pa-5">
      No transaction found!
    </div>

  </v-card>

</template>

<script>
export default {
  props: ['all', 'invoices']
};
</script>
