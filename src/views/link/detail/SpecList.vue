<template>
  <div class="mt-5">
    <v-card>
      <v-card-title class="d-block pb-2">
        <div class="d-flex">
          <v-icon class="mr-4">mdi-clipboard-edit-outline</v-icon>
          <div>Spec List</div>
        </div>
      </v-card-title>

      <div v-if="list.length">
        <v-divider></v-divider>

        <div 
          class="v-data-table v-data-table--dense theme--light put-behind">
          <div class="v-data-table__wrapper">
            <table style="table-layout: fixed">
              <thead>
                <tr>
                  <th class="t-head">Name</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in list" :key="row.id">
                  <th class="t-head">{{ row.key }}</th>
                  <td :title="row.value">{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <block-message 
        v-else dense
        :message="'No spec found.'"
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
}
</script>

<style scoped>
  .t-head {
    width: 15%;
    text-align: right !important;
  }
</style>
