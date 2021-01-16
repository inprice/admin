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

            <div class="caption px-1" :class="{ 'd-flex justify-space-between' : $vuetify.breakpoint.smAndUp }">

              <table class="my-auto">
                <tr>
                  <td>Ranking</td>
                  <td>:</td>
                  <th class="text-left">
                    <span class="teal--text">{{ row.position | toPosition }}</span>
                    (<span class="red--text">
                      {{ row.ranking && row.linkCount ? row.ranking + '/' + (row.linkCount+1) : 'NA' }}
                    </span>)
                  </th>
                </tr>
                <tr>
                  <td>Updated</td>
                  <td>:</td>
                  <th class="text-left">
                    <ago :date="row.updatedAt || row.createdAt" />
                  </th>
                </tr>
                <tr>
                  <td>Tags</td>
                  <td>:</td>
                  <td class="text-left">
                    {{ row.tags.length ? row.tags.join(', ') : 'NA' }}
                  </td>
                </tr>
                <tr v-if="!row.minSeller && $vuetify.breakpoint.xsOnly">
                  <td colspan="3" class="font-weight-bold">
                    Not classified since has no active competitor!
                  </td>
                </tr>
              </table>

              <table class="featuresTable caption" v-if="row.minSeller" :style="RESPROPS.priceTable.table">
                <tr>
                  <td width="10%" class="text-center">O</td>
                  <th width="20%">Price</th>
                  <th>Seller</th>
                  <th>Platform</th>
                </tr>
                <tr>
                  <th>Min</th>
                  <td class="text-right">{{ row.minPrice | toPrice }}</td>
                  <td>{{ row.minSeller }}</td>
                  <td>{{ row.minPlatform }}</td>
                </tr>
                <tr>
                  <th>Avg</th>
                  <td class="text-right">{{ row.avgPrice | toPrice }}</td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <th>Max</th>
                  <td class="text-right">{{ row.maxPrice | toPrice }}</td>
                  <td>{{ row.maxSeller }}</td>
                  <td>{{ row.maxPlatform }}</td>
                </tr>
              </table>

              <div v-if="!row.minSeller && $vuetify.breakpoint.smAndUp" class="font-weight-bold">
                Not classified since has no active competitor!
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
