<template>
  <v-card class="mt-5">
    <v-card-title class="pb-0">
      <v-icon class="mr-4">mdi-clipboard-list-outline</v-icon>
      <div class="col pa-0">
        <div>Transactions</div>
        <div>
          <div class="caption float-left">The list of operations in this company.</div>

          <v-btn-toggle class="float-right">
            <v-btn @click="selectedTab=0" small>
              All
            </v-btn>

            <v-btn @click="selectedTab=1" small>
              Invoices
            </v-btn>
          </v-btn-toggle>
        </div>

      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-tabs v-if="(all && all.length) || (invoices && invoices.length)" v-model="selectedTab">
      <v-tab-item v-if="all && all.length">
        <v-simple-table dense class="pb-1">
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
                <td><ago :date="row.createdAt"/></td>
                <td>{{ row.event }}</td>
                <td>{{ row.reason }}</td>
                <td>{{ row.description }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

      <v-tab-item v-if="invoices && invoices.length">
        <v-simple-table dense class="pb-1">
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
                <td>
                  <ago :date="row.createdAt" />
                </td>
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
  props: ['all', 'invoices'],
  data() {
    return {
      selectedTab: 0
    }
  },
};
</script>
