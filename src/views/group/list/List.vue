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

            <v-divider class="mb-2" v-if="row.total"></v-divider>

            <div class="d-flex flex-wrap justify-space-around px-1" :style="{ 'min-width': findMinWidthForCells }" v-if="row.total">

              <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile>
                <div class="caption text-uppercase font-weight-light">
                  Minimum Price
                </div>
                <div class="text-h6">
                  <span v-if="$vuetify.breakpoint.smAndDown">
                    {{ row.minPrice | toPrice }}
                  </span>
                  <span v-else>
                    {{ row.minPrice | toCurrency }}
                  </span>
                </div>
                <div class="caption">
                  {{ row.minPlatform }}, <b>{{ row.minSeller }}</b>
                </div>
              </v-card>

              <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile :style="{ 'min-width': findMinWidthForCells }">
                <div class="caption text-uppercase font-weight-light">
                  Maximum Price
                </div>
                <div class="text-h6">
                  <span v-if="$vuetify.breakpoint.smAndDown">
                    {{ row.maxPrice | toPrice }}
                  </span>
                  <span v-else>
                    {{ row.maxPrice | toCurrency }}
                  </span>
                </div>
                <div class="caption">
                  {{ row.maxPlatform }}, <b>{{ row.maxSeller }}</b>
                </div>
              </v-card>

              <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile :style="{ 'min-width': findMinWidthForCells }">
                <div class="caption text-uppercase font-weight-light">
                  Average Price
                </div>
                <div class="text-h6">
                  <span v-if="$vuetify.breakpoint.smAndDown">
                    {{ row.avgPrice | toPrice }}
                  </span>
                  <span v-else>
                    {{ row.avgPrice | toCurrency }}
                  </span>
                </div>
                <div>
                  <b>{{ row.actives }}</b> <span class="caption">active links</span>
                </div>
              </v-card>

              <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile v-if="!row.price" :style="{ 'min-width': findMinWidthForCells }">
                <div class="caption text-uppercase font-weight-light">
                  Total
                </div>
                <div class="text-h6">
                  <span v-if="$vuetify.breakpoint.smAndDown">
                    {{ row.total | toPrice }}
                  </span>
                  <span v-else>
                    {{ row.total | toCurrency }}
                  </span>
                </div>
                <div>
                  <b>{{ row.linkCount }}</b> <span class="caption">total links</span>
                </div>
              </v-card>

              <v-card class="col elevation-1 mr-1 mt-1 py-1" outlined tile v-if="row.price" :style="{ 'min-width': findMinWidthForCells }">
                <div class="caption text-uppercase font-weight-light">
                  Price
                </div>
                <div class="text-h6">
                  <span v-if="$vuetify.breakpoint.smAndDown">
                    {{ row.price | toPrice }}
                  </span>
                  <span v-else>
                    {{ row.price | toCurrency }}
                  </span>
                </div>
                <div>
                  <b>{{ row.ranking }}</b>, <span class="caption">ranking</span>
                </div>
              </v-card>

            </div>

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
    findMinWidthForCells() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '48%'
        default:
          return '25%'
      }
    }
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
