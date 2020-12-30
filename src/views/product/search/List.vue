<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="row in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card @click="edit(row.id)" class="mt-3 pa-1 pb-3 transition-swing" :class="`elevation-${hover ? 6 : 2}`">

            <div class="d-flex justify-space-between subtitle pa-2 font-weight-medium">
              <div>{{ row.name }}</div>
              <div class="blue--text lighten-1">{{ row.price | toPrice }}</div>
            </div>

            <v-divider class="mb-2"></v-divider>

            <div class="caption px-2 d-flex justify-space-between">
              <div style="line-height: 22px">
                Ranking: <span class="font-weight-bold">{{ row.ranking && row.linkCount ? row.ranking + '/' + (row.linkCount+1) : 'NA' }}</span>
                <span class="ml-1 blue--text lighten-1 font-weight-bold">({{ row.position | toPosition }})</span>
                <div>
                </div>
                  Updated: <ago :date="row.updatedAt || row.createdAt" class="d-inline font-weight-medium" />
                <div>
                  Tags: <span class="font-weight-medium">{{ row.tags.length ? row.tags.join(', ') : 'NA' }}</span>
                </div>
              </div>

              <div v-if="row.minSeller" class="font-weight-bold">
                <semi-chip 
                  bgColor="#eee" 
                  fgColor="green" 
                  tag="MIN"
                  :value="row.minPrice | toPrice" 
                  :title="row.minSeller + ' (' + row.minPlatform + ')'" />

                <semi-chip 
                  bgColor="#eee" 
                  fgColor="black" 
                  tag="AVG" 
                  :value="row.avgPrice | toPrice" />

                <semi-chip 
                  bgColor="#eee" 
                  fgColor="#c70040" 
                  tag="MAX" 
                  :value="row.maxPrice | toPrice" 
                  :title="row.maxSeller + ' (' + row.maxPlatform + ')'" />
              </div>

              <div class="caption px-2" v-else>
                Not classified yet!
              </div>
            </div>

          </v-card>

        </template>
      </v-hover>

    </div>

    <v-card v-else >
      <block-message v-if="updated" :message="'No product found! You can add a new one or change your criteria.'" />
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
    SemiChip: () => import('@/component/SemiChip.vue'),
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  updated() {
    this.$nextTick(() => this.updated = true);
  }
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