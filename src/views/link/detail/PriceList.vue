<template>
  <div class="mt-5">
    <div class="title mb-2">Prices</div>

    <v-card tile :loading="loading">
      <table class="info-table" v-if="list && list.length">
        <thead>
          <tr>
            <th>Date</th>
            <th class="text-right hidden-sm-and-down">Old Price</th>
            <th class="text-right">New Price</th>
            <th class="text-right">Diff</th>
            <th width="10%" class="text-right">Rate</th>
            <th width="5%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in list" :key="row.id">
            <td>{{ row.createdAt | formatPlainDate($vuetify.breakpoint.name) }}</td>
            <td class="text-right hidden-sm-and-down">{{ row.oldPrice | toPrice }}</td>
            <td class="text-right">{{ row.newPrice | toPrice }}</td>
            <td class="text-right">{{ row.diffAmount | toPrice }}</td>
            <td class="text-right pr-0">
              {{ row.diffRate | formatRate }}
            </td>
            <td class="text-left pl-0">
              <v-icon 
                class="ml-2"
                style="font-size:1.30rem"
                :color="findDiffColor(row.diffAmount)"
              >
                {{ findDiffIcon(row.diffAmount) }}
              </v-icon>
            </td>
          </tr>
        </tbody>
      </table>

      <block-message 
        v-else dense
        :message="'Has no price yet.'"
      />

    </v-card>

  </div>
</template>

<script>
export default {
  props: ['list', 'loading'],
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  }
}
</script>
