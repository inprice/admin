<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div class="d-flex">
          <v-icon class="mr-4">mdi-archive-outline</v-icon>
          <div>History List</div>
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
                  <th :width="RESPROPS.table.status">Status</th>
                  <th>Problem</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <td class="text-center">{{ row.createdAt | formatPlainDate }}</td>
                  <td>{{ row.statusGroup }}</td>
                  <td>{{ row.parseProblem }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'Has no changing yet.'"
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
            table: { date: '200px', status: '150px' },
          };
        }
        default: {
          return {
            'table-layout': '',
            table: { date: '20%', status: '15%' },
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
