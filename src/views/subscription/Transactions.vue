<template>
  <v-card class="mt-5">
    <v-card-title>
      <v-icon class="mr-4">mdi-clipboard-list-outline</v-icon>
      <div>
        <div>Transactions</div>
        <div class="caption">The list of operations in this company.</div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-simple-table v-if="rows && rows.length">
      <template v-slot:default>
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="10%">Event</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.createdAt | formatDate }}</td>
            <td>{{ row.event }}</td>
            <td>{{ JSON.parse(row.data).description }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div v-else class="pa-5">
      No transaction found!
    </div>

  </v-card>

</template>

<script>
export default {
  props: ['rows']
};
</script>
