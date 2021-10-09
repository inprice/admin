<template>
  <div>
    <div class="title mt-5">Invoices</div>

    <v-card class="mt-2">
      <table class="body-2" v-if="invoices && invoices.length">
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="25%">Event</th>
            <th class="hidden-sm-and-down">File URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in invoices" :key="row.id">
            <td>
              <ago :date="row.createdAt" />
            </td>
            <td>{{ row.event }}</td>
            <td class="hidden-sm-and-down">
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
    </v-card>

    <div v-if="$store.get('session/isSuperUser')" class="title mt-5">Transactions</div>

    <v-card v-if="$store.get('session/isSuperUser')" class="mt-2">
      <table 
        class="info-table pb-2" 
        v-if="(all && all.length) || (invoices && invoices.length)"
      >
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="20%">Event</th>
            <th class="hidden-sm-and-down">Description</th>
            <th class="hidden-sm-and-down">Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in all" :key="row.id">
            <td><ago :date="row.createdAt"/></td>
            <td>{{ row.event }}</td>
            <td class="hidden-sm-and-down">{{ row.description }}</td>
            <td class="hidden-sm-and-down">{{ row.reason }}</td>
          </tr>
        </tbody>
      </table>

      <block-message 
        v-else dense
        :message="'You have no transaction.'"
      />
    </v-card>

  </div>
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
