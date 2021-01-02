<template>
  <v-card class="mt-3">

    <v-card-title class="pb-2">
      <v-icon class="mr-4 hidden-xs-only">mdi-clipboard-list-outline</v-icon>
      <div>
        <div>Transactions</div>
        <div class="caption">The list of operations in this account.</div>
      </div>
    </v-card-title>

    <v-btn-toggle :value="selectedTab" class="mt-2">
      <v-btn @click="selectedTab=0" small>
        All
      </v-btn>

      <v-btn @click="selectedTab=1" small>
        Invoices
      </v-btn>
    </v-btn-toggle>

    <v-divider></v-divider>

    <v-tabs v-model="selectedTab">
      <v-tab-item>
        <div 
          class="v-data-table v-data-table--dense theme--light put-behind" 
          v-if="(all && all.length) || (invoices && invoices.length)">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.transTable.date">Date</th>
                  <th :width="RESPROPS.transTable.event">Event</th>
                  <th :width="RESPROPS.transTable.description">Description</th>
                  <th :width="RESPROPS.transTable.reason">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in all" :key="row.id">
                  <td><ago :date="row.createdAt"/></td>
                  <td>{{ row.event }}</td>
                  <td>{{ row.description }}</td>
                  <td>{{ row.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <block-message 
          v-else dense
          :message="'You have no transaction.'"
        />
      </v-tab-item>

      <v-tab-item>
        <div 
          class="v-data-table v-data-table--dense theme--light put-behind" 
          v-if="invoices && invoices.length">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}" class="pb-2">
              <thead>
                <tr>
                  <th :width="RESPROPS.invoiceTable.date">Date</th>
                  <th :width="RESPROPS.invoiceTable.event">Event</th>
                  <th :width="RESPROPS.invoiceTable.url">File URL</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in invoices" :key="row.id">
                  <td>
                    <ago :date="row.createdAt" />
                  </td>
                  <td>{{ row.event }}</td>
                  <td>
                    <div class="text-truncate" v-if="$store.get('session/isEditor')">
                      <a :href="row.fileUrl" target="_blank">{{ row.fileUrl }}</a>
                    </div>
                    <span v-else>Hidden for unauthorized users!</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <block-message 
          v-else dense
          :message="'You have no invoice.'"
        />
      </v-tab-item>
    </v-tabs>

  </v-card>

</template>

<script>
export default {
  props: ['all', 'invoices'],
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            transTable: { date: '200px', event: '220px', description: '400px', reason: '400px' },
            invoiceTable: { date: '200px', event: '220px', url: '500px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            transTable: { date: '15%', event: '20%', description: '40%', reason: '' },
            invoiceTable: { date: '15%', event: '25%', url: '' },
          };
        }
      }
    },
  },
  data() {
    return {
      selectedTab: 0
    }
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
};
</script>
