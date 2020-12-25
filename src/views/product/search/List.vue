<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="row in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card @click="edit(row.id)" class="mt-3 pa-1 pb-3 transition-swing" :class="`elevation-${hover ? 6 : 2}`">
            <div class="d-flex justify-space-between subtitle px-3 pt-1 font-weight-medium">
              <div>{{ row.name }}</div>
              <div>{{ row.price | toCurrency }}</div>
            </div>
            <div class="d-flex justify-space-between px-3 caption">
              <ago :date="row.updatedAt || row.createdAt" />
              <div class="blue--text">{{ row.position | toPosition }}</div>
            </div>

            <div class="d-flex justify-space-between mt-1">
              <div class="ml-2" v-if="row.tags && row.tags.length">
                <v-chip
                  class="mr-1"
                  outlined label small
                  v-for="(tag, index) in row.tags" :key="index"
                >
                  {{ tag }}
                </v-chip>
              </div>
              <div class="caption ml-3 green--text font-weight-medium" v-else>
                #{{ row.code }}
              </div>

              <div class="caption px-2" v-if="row.minSeller">
                <v-chip class="ml-1" outlined label small :title="row.minSeller + ' (' + row.minPlatform + ')'">
                  Min: <span class="ml-2 font-weight-bold green--text">{{ row.minPrice }}</span>
                </v-chip>
                <v-chip class="ml-1" outlined label small>
                  Avg: <span class="ml-2 font-weight-bold">{{ row.avgPrice }}</span>
                </v-chip>
                <v-chip class="ml-1" outlined label small :title="row.maxSeller + ' (' + row.maxPlatform + ')'">
                  Max: <span class="ml-2 font-weight-bold red--text">{{ row.maxPrice }}</span>
                </v-chip>
              </div>
              <div class="caption px-3" v-else>
                Not classified yet!
              </div>
            </div>

          </v-card>

        </template>
      </v-hover>

    </div>

    <v-card v-else >
      <block-message :message="'No product found! You can add a new one or change your criteria.'" />
    </v-card>

  </div>

</template>

<script>
export default {
  props: ['rows', 'isLoading'],
  methods: {
    edit(id) {
      this.$emit('edit', id);
    },
  },
  components: {
    BlockMessage: () => import('@/component/simple/BlockMessage.vue'),
  },
};
</script>

<style scoped>
  tr {
    cursor: pointer;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>