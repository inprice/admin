<template>
  <div class="mt-5">

    <v-card-title>History</v-card-title>

    <v-divider></v-divider>

    <v-card elevation="0">
      <v-simple-table dense v-if="list && list.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th width="170px" class="text-center">Status</th>
              <th width="200px">Date</th>
              <th class="hidden-xs-only">Problem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in list" :key="row.id">
              <td>
                <v-icon :color="findStatusColor(row.statusGroup)">{{ findStatusIcon(row.statusGroup) }}</v-icon>
                <span class="pl-4">{{ row.statusGroup }}</span>
              </td>
              <td>{{ row.createdAt | formatPlainDate }}</td>
              <td class="hidden-xs-only">{{ row.parseProblem }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-divider v-if="list && list.length"></v-divider>

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
}
</script>
