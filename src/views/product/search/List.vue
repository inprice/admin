<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="row in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card @click="edit(row.id)" class="mt-3 pb-2 transition-swing" :class="`elevation-${hover ? 6 : 2}`">
            <div class="d-flex justify-space-between headline px-3 pt-1">
              <div class="">{{ row.name }}</div>
              <div>{{ row.price | toPrice }}</div>
            </div>
            <div class="d-flex justify-space-between pb-1 px-3 caption">
              <ago :date="row.updatedAt || row.createdAt" />
              <div>{{ row.position | toPosition }}</div>
            </div>

            <div class="d-flex justify-space-between">
              <div class="ml-2">
                <v-chip
                  class="mr-1"
                  outlined small
                  v-for="(tag, index) in row.tags" :key="index"
                >
                  {{ tag }}
                </v-chip>
              </div>

              <div class="caption px-2 pt-1" v-if="row.minSeller">
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
              <div class="caption px-2 pt-1" v-else>
                Not classified yet!
              </div>
            </div>

          </v-card>

        </template>
      </v-hover>

    </div>

    <p class="mt-3" v-else>
      No product found! You can add a new one or change your criteria.
    </p>

  </div>

</template>

<script>
import Consts from "@/data/system";

export default {
  props: ['rows', 'isLoading'],
  computed: {
    tagcolors() {
      return Consts.system.TAG_COLORS;
    }
  },
  methods: {
    edit(id) {
      this.$emit('edit', id);
    },
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