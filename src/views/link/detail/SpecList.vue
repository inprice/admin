<template>
  <div>
    <v-card :loading="loading" style="max-height: 350px; overflow-y: auto;">
      <table class="specs-table" v-if="list.length">
        <tr v-for="(row, index) in list" :key="index">
          <td width="5%" class="text-center">
            <v-icon color="green">mdi-circle-small</v-icon>
          </td>
          <td>
            <div class="caption blue--text">{{ row.key }}</div>
            <div class="body-2">{{ row.value }}</div>
          </td>
        </tr>
      </table>

      <block-message 
        v-else dense
        :message="'No spec found.'"
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
