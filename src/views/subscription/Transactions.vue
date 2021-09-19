<template>
  <v-card class="mt-3">

    <v-card-title class="pb-2">
      <v-icon class="mr-4 hidden-xs-only">mdi-clipboard-list-outline</v-icon>
      <div>
        <div>Transactions</div>
        <div class="caption">The list of operations in this workspace.</div>
      </div>
    </v-card-title>

    <v-btn-toggle tile :value="selectedTab">
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
        <table 
          class="info-table pb-2" 
          v-if="(all && all.length) || (invoices && invoices.length)"
        >
          <thead>
            <tr>
              <th width="15%" class="text-left">Date</th>
              <th width="20%" class="text-left">Event</th>
              <th class="text-left">Description</th>
              <th class="text-left">Reason</th>
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

        <block-message 
          v-else dense
          :message="'You have no transaction.'"
        />
      </v-tab-item>

      <v-tab-item>
        <table class="body-2" v-if="invoices && invoices.length">
          <thead>
            <tr>
              <th width="15%" class="text-left">Date</th>
              <th width="25%" class="text-left">Event</th>
              <th class="text-left">File URL</th>
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
