<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div class="d-flex">
          <v-icon class="mr-4 hidden-xs-only">mdi-cash-100</v-icon>
          <div class="d-inline">
            <div>Price List</div>
            <div class="caption">All the changing prices by time</div>
          </div>
        </div>
      </v-card-title>

      <div v-if="list.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table :style="{'table-layout': RESPROPS['table-layout']}">
              <thead>
                <tr>
                  <th class="text-center" :width="RESPROPS.table.date">Date</th>
                  <th class="text-right" :width="RESPROPS.table.diff">Diff.Amount</th>
                  <th class="text-right" :width="RESPROPS.table.diff">Diff.Rate</th>
                  <th :width="RESPROPS.table.dir">Dir</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td class="text-center">{{ row.createdAt }}</td>
                  <td class="text-right">{{ row.diffAmount | toPrice }}</td>
                  <td class="text-right" >{{ row.diffRate }}%</td>
                  <td>{{ row.diffRate == 0 ? '-' : (row.diffRate > 0 ? 'UP' : 'DOWN') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'Has no price yet.'"
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
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm': {
          return {
            'table-layout': 'fixed',
            table: { date: '200px', amount: '150px', diff: '100px', dir: '70px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { date: '20%', amount: '15%', diff: '10%', dir: '8%' },
          };
        }
      }
    },
  },
}
</script>

<style scoped>
  .v-data-table th {
    height: 30px;
  }
</style>
