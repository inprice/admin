<template>
  <div class="mt-5">

    <div class="title mb-2">Specs</div>

    <v-card :loading="loading" style="max-height: 350px; overflow-y: auto;">
      <v-list dense v-if="list.length">
        <template v-for="(row, index) in list">

          <v-list-item :key="index" link>
            <v-list-item-avatar>
              <v-icon color="green">mdi-circle-small</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <div class="caption blue--text">{{ row.key }}</div>
              <div class="body-2">{{ row.value }}</div>
            </v-list-item-content>

          </v-list-item>

          <v-divider v-if="index < list.length-1" :key="(index+1)*-1"></v-divider>

        </template>
      </v-list>

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
