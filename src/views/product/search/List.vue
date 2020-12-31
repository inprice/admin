<template>
  <div>

    <div v-if="rows && rows.length">

      <v-hover v-for="row in rows" :key="row.id">
        <template v-slot="{ hover }">

          <v-card @click="edit(row.id)" class="mt-3 pa-1 pb-2 transition-swing" :class="`elevation-${hover ? 6 : 2}`">

            <div class="d-flex justify-space-between subtitle pa-2 font-weight-medium">
              <div>{{ row.name }}</div>
              <div class="pl-2 cyan--text font-weight-bold">{{ row.price | toPrice }}</div>
            </div>

            <v-divider class="mb-2"></v-divider>

            <div class="caption px-2 d-flex justify-space-between">
              <div style="line-height: 22px">
                Ranking: <span class="font-weight-bold">{{ row.ranking && row.linkCount ? row.ranking + '/' + (row.linkCount+1) : 'NA' }}</span>
                <span class="ml-1 blue--text font-weight-bold">({{ row.position | toPosition }})</span>
                <div>
                </div>
                  Updated: <ago :date="row.updatedAt || row.createdAt" class="d-inline font-weight-medium" />
                <div>
                  Tags: <span class="font-weight-medium">{{ row.tags.length ? row.tags.join(', ') : 'NA' }}</span>
                </div>
              </div>

              <table class="featuresTable caption" v-if="row.minSeller" :style="RESPROPS.priceTable.table">
                <tr>
                  <td width="10%" class="text-center">O</td>
                  <th width="20%">Price</th>
                  <th v-if="$vuetify.breakpoint.smAndUp" width="40%">Seller</th>
                  <th v-if="$vuetify.breakpoint.smAndUp" width="30%">Platform</th>
                </tr>
                <tr>
                  <th>Min</th>
                  <td class="text-right">{{ row.minPrice | toPrice }}</td>
                  <td v-if="$vuetify.breakpoint.smAndUp">{{ row.minSeller }}</td>
                  <td v-if="$vuetify.breakpoint.smAndUp">{{ row.minPlatform }}</td>
                </tr>
                <tr>
                  <th>Avg</th>
                  <td class="text-right">{{ row.avgPrice | toPrice }}</td>
                  <td v-if="$vuetify.breakpoint.smAndUp" colspan="2"></td>
                </tr>
                <tr>
                  <th>Max</th>
                  <td class="text-right">{{ row.maxPrice | toPrice }}</td>
                  <td v-if="$vuetify.breakpoint.smAndUp">{{ row.maxSeller }}</td>
                  <td v-if="$vuetify.breakpoint.smAndUp">{{ row.maxPlatform }}</td>
                </tr>
              </table>

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
  computed: {
    RESPROPS() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': {
          return {
            priceTable: { table: 'max-width: 35%' },
          };
        }
        case 'sm': {
          return {
            priceTable: { table: 'max-width: 50%' },
          };
        }
        default: {
          return {
            priceTable: { table: '' },
          };
        }
      }
    },
  },
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
    BlockMessage: () => import('@/component/simple/BlockMessage.vue')
  },
  updated() {
    this.$nextTick(() => this.updated = true);
  }
};
</script>
