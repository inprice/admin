<template>
  <v-card class="mt-5">
    <v-card-title>
      <v-icon class="mr-4">mdi-format-list-checks</v-icon>
      <div>
        <div>Plans</div>
        <div class="caption">
          <span v-if="status == 'NOT_SET'">
            You have no active plan in the moment. Please pick one to start monitoring.
          </span>
          <span v-if="status == 'COUPONED'">
            You can select a plan from the followings to start monitoring.
          </span>
        </div>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th width="15%">Name</th>
            <th>Description</th>
            <th width="10%" class="text-right">Price *</th>
            <th width="5%" class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.name }}</td>
            <td>Up to {{ row.productLimit }} products.</td>
            <td class="text-right font-weight-bold">{{ '$' + row.price.toFixed(2) }}</td>
            <td class="text-center">
              <v-btn
                small
                color="success"
                class="mx-2"
                @click="buy(row.stripeProdId)"
              >
                Buy
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider></v-divider>

    <div class="caption pa-4"><strong>* Please Note that: </strong> Prices in this table are monthly basis!</div>

  </v-card>

</template>

<script>
export default {
  props: ['rows', 'status'],
  methods: {
    buy(stripeProdId) {
      this.$emit('buy', stripeProdId);
    }
  },
};
</script>
