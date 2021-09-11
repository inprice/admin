<template>
  <div class="mt-5">
    <v-card elevation="0">
      <v-card-title>Specs</v-card-title>

      <v-divider></v-divider>

      <v-list dense v-if="list.length">
        <template v-for="(row, index) in list">

          <v-list-item :key="index" >
            <v-list-item-avatar>
              <v-icon style="font-size:40px;" color="light-blue">mdi-circle-small</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <div class="caption font-weight-light">{{ row.key }}</div>
              <div class="body-2">{{ row.value }}</div>
            </v-list-item-content>

          </v-list-item>

          <v-divider :key="(index+1)*-1"></v-divider>

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
  props: ['list'],
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
}
</script>
