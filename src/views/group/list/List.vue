<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="row in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card class="mt-3 pa-1 pb-2" :class="`elevation-${hover ? 3 : 1}`" tile>
            <div class="d-flex justify-space-between subtitle pa-2 font-weight-medium">
              <div>{{ row.name }}</div>
              <v-btn 
                small 
                @click="edit(row.id)">
                  Edit
              </v-btn>
            </div>

            <prices :group="row" />
          </v-card>

        </template>
      </v-hover>

    </div>

    <v-card v-else >
      <block-message v-if="updated" :message="'No group found! You can add a new one or change your criteria.'" />
    </v-card>

  </div>

</template>

<script>
export default {
  props: ['rows', 'isLoading'],
  data() {
    return {
      updated: false,
    }
  },
  methods: {
    edit(id) {
      this.$emit('edit', id);
    },
  },
  components: {
    Prices: () => import('../Prices.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  updated() {
    this.$nextTick(() => this.updated = true);
  }
};
</script>
