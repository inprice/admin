<template>
  <div class="mt-5">

    <div class="title mb-2">History</div>

    <v-card tile :loading="loading">
      <table class="info-table" v-if="list && list.length">
        <thead>
          <tr>
            <th width="15%">Date</th>
            <th width="20%">Status</th>
            <th class="hidden-xs-only">Problem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in list" :key="row.id">
            <td>{{ row.createdAt | formatPlainDate }}</td>
            <td>
              <v-icon>{{ findStatusIcon(row.grup) }}</v-icon>
              <span class="pl-2">{{ row.grup }}</span>
            </td>
            <td class="hidden-xs-only">{{ row.parseProblem }}</td>
          </tr>
        </tbody>
      </table>

      <block-message 
        v-else dense
        :message="'Has no changing yet.'"
      />

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['list', 'loading'],
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
